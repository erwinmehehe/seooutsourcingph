#!/usr/bin/env python3
"""Small same-origin submission handler for the SEO Outsourcing Philippines demo.

The public HTML never contains a CRM key or SMTP password. Submissions are stored
in a private SQLite file on this host. Email notification is optional and must be
configured by the site owner. Deploy behind an HTTPS reverse proxy.
"""
import argparse
import csv
from contextlib import contextmanager
from datetime import datetime, timezone, timedelta
from email.message import EmailMessage
import hashlib
import hmac
import ipaddress
from http import HTTPStatus
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import re
import secrets
import smtplib
import sqlite3
import ssl
import time
from urllib.parse import urlparse

BASE = Path(__file__).resolve().parent
DATA = Path(os.getenv('SEO_LEADS_DATA_DIR', str(BASE / 'private'))).resolve()
DATA.mkdir(mode=0o700, parents=True, exist_ok=True)
DB = DATA / 'leads.sqlite3'
PRODUCTION = os.getenv('SEO_PRODUCTION','0') == '1'
FORM_ENABLED = os.getenv('SEO_FORM_ENABLED','0') == '1'
COOKIE_SECURE = os.getenv('SEO_COOKIE_SECURE','1' if PRODUCTION else '0') == '1'
EXPECTED_HOST = os.getenv('SEO_PUBLIC_HOST','').lower().strip()
SECRET_FILE = DATA / '.submission_secret'
if os.getenv('SEO_FORM_SECRET'):
    SECRET = os.environ['SEO_FORM_SECRET'].encode('utf-8')
elif SECRET_FILE.exists():
    SECRET = SECRET_FILE.read_bytes()
else:
    SECRET = secrets.token_bytes(32)
    SECRET_FILE.write_bytes(SECRET)
    os.chmod(SECRET_FILE, 0o600)
ALLOWED_PLANS = {
    'Not sure — recommend a scope', 'Not sure - recommend a scope', 'SEO Essential', 'SEO Growth', 'SEO Scale',
    'Custom project / dedicated team'
}
EMAIL_RE = re.compile(r'^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$')
TRUSTED_PROXIES = {ip.strip() for ip in os.getenv('SEO_TRUSTED_PROXY_IPS', '').split(',') if ip.strip()}


@contextmanager
def db_connect():
    con = sqlite3.connect(DB, timeout=10)
    try:
        con.execute('PRAGMA journal_mode=WAL')
        if DB.exists(): os.chmod(DB, 0o600)
        con.execute('''CREATE TABLE IF NOT EXISTS inquiries (
          reference TEXT PRIMARY KEY, created_at INTEGER NOT NULL, ip_hash TEXT NOT NULL,
          audience TEXT NOT NULL, plan TEXT NOT NULL, name TEXT NOT NULL,
          email TEXT NOT NULL, company TEXT NOT NULL, website TEXT NOT NULL,
          details TEXT NOT NULL, consent_at INTEGER NOT NULL, notification_status TEXT NOT NULL
        )''')
        con.execute('CREATE INDEX IF NOT EXISTS inquiries_created_idx ON inquiries(created_at)')
        con.execute('CREATE INDEX IF NOT EXISTS inquiries_rate_idx ON inquiries(ip_hash, created_at)')
        with con:
            yield con
    finally:
        con.close()


def signed_token(session_id, stamp):
    payload = (session_id + ':' + str(stamp)).encode('utf-8')
    return str(stamp) + '.' + hmac.new(SECRET, payload, hashlib.sha256).hexdigest()


def check_token(session_id, token):
    if not session_id or not isinstance(token, str) or '.' not in token:
        return False
    try:
        stamp = int(token.split('.', 1)[0])
    except (TypeError, ValueError):
        return False
    age = time.time() - stamp
    if not -5 <= age <= 3600:
        return False
    return hmac.compare_digest(token, signed_token(session_id, stamp))


def validated_text(value, limit, label, required=False):
    if not isinstance(value, str):
        raise ValueError(label + ' must be text.')
    value = value.strip()
    if len(value) > limit or (required and not value):
        raise ValueError('Please enter a valid ' + label.lower() + '.')
    # Remove control characters while preserving whitespace and newlines.
    return ''.join(ch for ch in value if ch in '\n\r\t' or ord(ch) >= 32)


def validate(data):
    if data.get('phone_confirm'):
        raise ValueError('Request cannot be accepted.')
    if data.get('consent') is not True:
        raise ValueError('Please agree to be contacted about this request.')
    audience = data.get('audience', '')
    if audience not in ('agency', 'business'):
        raise ValueError('Choose whether you need support for an agency or a business.')
    plan = data.get('plan', '')
    if plan not in ALLOWED_PLANS:
        raise ValueError('Please choose a support option.')
    name = validated_text(data.get('name', ''), 120, 'Full name', required=True)
    email = validated_text(data.get('email', ''), 254, 'Work email', required=True)
    if not EMAIL_RE.fullmatch(email):
        raise ValueError('Please enter a valid work email.')
    company = validated_text(data.get('company', ''), 160, 'Company')
    website = validated_text(data.get('website', ''), 300, 'Website')
    if website:
        u = urlparse(website)
        if u.scheme not in ('http', 'https') or not u.hostname:
            raise ValueError('Website should start with https:// or http://.')
    details = validated_text(data.get('details', ''), 5000, 'Project details', required=True)
    if len(details) < 20:
        raise ValueError('Please add a little more detail about the SEO work.')
    return {'audience': audience, 'plan': plan, 'name': name, 'email': email,
            'company': company, 'website': website, 'details': details}


def notify(payload, reference):
    host = os.getenv('SMTP_HOST', '').strip()
    if not host:
        return 'not_configured'
    port = int(os.getenv('SMTP_PORT', '587'))
    username = os.getenv('SMTP_USER', '')
    password = os.getenv('SMTP_PASSWORD', '')
    sender = os.getenv('SMTP_FROM', '')
    recipient = os.getenv('NOTIFY_EMAIL', 'info@seooutsourcingphilippines.com')
    if not sender:
        return 'missing_from'
    msg = EmailMessage()
    msg['Subject'] = '[SEO scope request] ' + reference + ' - ' + payload['plan']
    msg['From'] = sender
    msg['To'] = recipient
    msg['Reply-To'] = payload['email']
    msg.set_content('\n'.join([
        'Reference: ' + reference, 'Audience: ' + payload['audience'],
        'Plan: ' + payload['plan'], 'Name: ' + payload['name'],
        'Email: ' + payload['email'], 'Company: ' + payload['company'],
        'Website: ' + payload['website'], '', 'Project details:', payload['details']
    ]))
    try:
        if port == 465:
            with smtplib.SMTP_SSL(host, port, timeout=10, context=ssl.create_default_context()) as s:
                if username: s.login(username, password)
                s.send_message(msg)
        else:
            with smtplib.SMTP(host, port, timeout=10) as s:
                s.starttls(context=ssl.create_default_context())
                if username: s.login(username, password)
                s.send_message(msg)
        return 'smtp_accepted'
    except Exception as exc:
        print('Notification could not be sent for', reference, type(exc).__name__, flush=True)
        return 'send_failed'


class Handler(BaseHTTPRequestHandler):
    def setup(self):
        super().setup()
        self.connection.settimeout(15)

    def log_message(self, fmt, *args):
        # Access logs omit request bodies, names, and email addresses.
        # Do not log query parameters, submitted values or full request targets.
        print('request %s %s' % (self.command, urlparse(self.path).path[:180]), flush=True)

    def client_ip(self):
        source = self.client_address[0]
        if source in TRUSTED_PROXIES:
            forwarded = self.headers.get('X-Forwarded-For', '').split(',')[0].strip()
            try:
                if forwarded:
                    ipaddress.ip_address(forwarded)
                    return forwarded
            except ValueError:
                pass
        return source

    def reply(self, status, obj, cookie=None):
        raw = json.dumps(obj, ensure_ascii=True).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(raw)))
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
        if cookie:
            secure = '; Secure' if COOKIE_SECURE else ''
            self.send_header('Set-Cookie', 'seo_sid=' + cookie + '; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax' + secure)
        self.end_headers()
        self.wfile.write(raw)

    def do_GET(self):
        path = urlparse(self.path).path
        if path in ('/', '/index.html'):
            data = (BASE / 'index.html').read_bytes()
            self.send_response(HTTPStatus.OK)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(data)))
            self.send_header('X-Content-Type-Options', 'nosniff')
            self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
            self.end_headers()
            self.wfile.write(data)
        elif path == '/api/session':
            if not FORM_ENABLED:
                self.reply(503, {'ok': False, 'error':'Form service is not configured.'}); return
            try:
                with db_connect() as db:
                    days = max(1, int(os.getenv('SEO_RETENTION_DAYS', '90')))
                    db.execute('DELETE FROM inquiries WHERE created_at<?', (int(time.time())-days*86400,))
            except (sqlite3.Error, ValueError):
                pass
            session_id = secrets.token_urlsafe(24)
            self.reply(200, {'csrf_token': signed_token(session_id, int(time.time()))}, cookie=session_id)
        elif path == '/api/health':
            configured = bool(FORM_ENABLED and os.getenv('SMTP_HOST') and os.getenv('SMTP_FROM') and os.getenv('NOTIFY_EMAIL'))
            self.reply(200 if configured else 503, {'ok': configured, 'form_configured': configured})
        else:
            self.reply(404, {'ok': False, 'error': 'Not found'})

    def do_POST(self):
        if not FORM_ENABLED:
            self.reply(503, {'ok': False, 'error': 'Form service is not configured.'}); return
        if urlparse(self.path).path != '/api/inquiry':
            self.reply(404, {'ok': False, 'error': 'Not found'})
            return
        if EXPECTED_HOST and self.headers.get('Host','').split(':')[0].lower() != EXPECTED_HOST:
            self.reply(403, {'ok': False, 'error':'Unexpected request host.'}); return
        origin = self.headers.get('Origin')
        if origin:
            source = urlparse(origin)
            host = self.headers.get('Host', '').lower()
            if source.netloc.lower() != host or (PRODUCTION and source.scheme != 'https'):
                self.reply(403, {'ok': False, 'error': 'Origin is not allowed.'})
                return
        if not self.headers.get('Content-Type', '').startswith('application/json'):
            self.reply(415, {'ok': False, 'error': 'Expected JSON request.'})
            return
        try:
            length = int(self.headers.get('Content-Length', '0'))
        except ValueError:
            length = 0
        if not 0 < length <= 12000:
            self.reply(413, {'ok': False, 'error': 'Request is too large.'})
            return
        try:
            data = json.loads(self.rfile.read(length))
            if not isinstance(data, dict):
                raise ValueError('Invalid request data.')
            cookie = SimpleCookie()
            cookie.load(self.headers.get('Cookie', ''))
            session_id = cookie['seo_sid'].value if 'seo_sid' in cookie else ''
            if not check_token(session_id, data.get('csrf_token')):
                raise ValueError('Your form session expired. Refresh and try again.')
            payload = validate(data)
        except (ValueError, json.JSONDecodeError, UnicodeDecodeError) as exc:
            self.reply(400, {'ok': False, 'error': str(exc)[:180]})
            return
        stamp = int(time.time())
        ip_hash = hmac.new(SECRET, self.client_ip().encode('utf-8'), hashlib.sha256).hexdigest()
        reference = 'SEO-' + datetime.now(timezone.utc).strftime('%Y%m%d') + '-' + secrets.token_hex(3).upper()
        try:
            with db_connect() as db:
                recent = db.execute('SELECT COUNT(*) FROM inquiries WHERE ip_hash=? AND created_at>?',
                                    (ip_hash, stamp-1800)).fetchone()[0]
                if recent >= 3:
                    self.reply(429, {'ok': False, 'error': 'Too many requests. Try again later.'})
                    return
                db.execute('INSERT INTO inquiries VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', (
                    reference, stamp, ip_hash, payload['audience'], payload['plan'],
                    payload['name'], payload['email'], payload['company'], payload['website'],
                    payload['details'], stamp, 'pending'))
                days = max(1, int(os.getenv('SEO_RETENTION_DAYS', '90')))
                db.execute('DELETE FROM inquiries WHERE created_at<?', (stamp - days*86400,))
            notify_state = notify(payload, reference)
            with db_connect() as db:
                db.execute('UPDATE inquiries SET notification_status=? WHERE reference=?', (notify_state, reference))
            self.reply(201, {'ok': True, 'reference': reference})
        except sqlite3.Error:
            self.reply(503, {'ok': False, 'error': 'Submission service is temporarily unavailable.'})


def retry_notifications():
    """Operator-only command; recover saved requests whose notification failed."""
    with db_connect() as db:
        rows = db.execute("SELECT reference,audience,plan,name,email,company,website,details FROM inquiries WHERE notification_status IN ('pending','not_configured','missing_from','send_failed') ORDER BY created_at LIMIT 100").fetchall()
    failed = 0
    for row in rows:
        reference = row[0]
        payload = dict(zip(['audience','plan','name','email','company','website','details'],row[1:]))
        status = notify(payload,reference)
        with db_connect() as db:
            db.execute('UPDATE inquiries SET notification_status=? WHERE reference=?',(status,reference))
        if status != 'smtp_accepted': failed += 1
    print('Notifications processed:',len(rows),'remaining failures:',failed,flush=True)
    return failed


def backup_database(path):
    destination = Path(path).resolve()
    if destination == DB.resolve() or destination.exists():
        raise ValueError('Choose a new private backup file, separate from the live database.')
    destination.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    fd = os.open(destination, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    os.close(fd)
    with db_connect() as source:
        target = sqlite3.connect(destination)
        try:
            source.backup(target)
        finally:
            target.close()
    os.chmod(destination, 0o600)
    print('Private database backup created.', flush=True)


def export_leads(path):
    columns = ['reference','created_at','audience','plan','name','email','company',
               'website','details','consent_at','notification_status']
    with db_connect() as db:
        rows = db.execute('SELECT ' + ','.join(columns) + ' FROM inquiries ORDER BY created_at DESC').fetchall()
    fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, 'w', encoding='utf-8', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(columns)
        for row in rows:
            # Prevent spreadsheet formula execution when an admin opens the export.
            safe = []
            for cell in row:
                if isinstance(cell, str) and cell.lstrip().startswith(('=', '+', '-', '@')):
                    cell = "'" + cell
                safe.append(cell)
            writer.writerow(safe)
    os.chmod(path, 0o600)
    print('Exported', len(rows), 'lead(s) to', path)


def production_preflight():
    if not PRODUCTION: return
    required = ['SEO_FORM_SECRET','SEO_LEADS_DATA_DIR','SEO_PUBLIC_HOST','SMTP_HOST','SMTP_FROM','NOTIFY_EMAIL']
    missing = [k for k in required if not os.getenv(k)]
    if missing or not FORM_ENABLED or not COOKIE_SECURE:
        raise RuntimeError('Production form configuration incomplete. Check credentials, HTTPS cookie, and mail delivery. Missing: ' + ','.join(missing))
    if len(os.getenv('SEO_FORM_SECRET','')) < 32:
        raise RuntimeError('SEO_FORM_SECRET must be at least 32 random characters for production')

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--host', default='127.0.0.1')
    parser.add_argument('--port', type=int, default=8000)
    parser.add_argument('--export-leads', metavar='OUTPUT_CSV')
    args = parser.parse_args()
    if args.export_leads:
        export_leads(args.export_leads)
    else:
        production_preflight()
        with db_connect(): pass
        server = ThreadingHTTPServer((args.host, args.port), Handler)
        print('SEO landing page: http://%s:%s/' % (args.host, args.port), flush=True)
        print('Submissions stored in', DB, flush=True)
        server.serve_forever()
