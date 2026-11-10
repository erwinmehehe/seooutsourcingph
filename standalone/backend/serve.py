#!/usr/bin/env python3
"""Same-origin SEO site and inquiry API; deploy behind an approved HTTPS reverse proxy."""
import argparse, base64, hashlib, mimetypes, re
from pathlib import Path
from http import HTTPStatus
from http.server import ThreadingHTTPServer
from urllib.parse import urlparse, unquote
from server import Handler, db_connect, DB, export_leads, PRODUCTION, production_preflight

ROOT=(Path(__file__).resolve().parent.parent/'site').resolve()

class SiteHandler(Handler):
    def do_GET(self):
        self._site_request(head=False)

    def do_HEAD(self):
        self._site_request(head=True)

    def _site_request(self, head=False):
        parsed=urlparse(self.path)
        path=parsed.path
        suffix=('?'+parsed.query) if parsed.query else ''
        if path.startswith('/api/'):
            if head:
                self.send_response(405)
                self.send_header('Allow','GET, POST')
                self.end_headers()
            else:
                return super().do_GET()
            return
        raw=unquote(path)
        if '\\' in raw or '\x00' in raw or any(part.startswith('.') for part in raw.split('/') if part):
            return self.send_error(HTTPStatus.NOT_FOUND)
        candidate=(ROOT/raw.lstrip('/')).resolve()
        if not candidate.is_relative_to(ROOT):
            return self.send_error(HTTPStatus.NOT_FOUND)
        if path == '/index.html' or path.endswith('/index.html'):
            destination=(path[:-len('index.html')] or '/')+suffix
            self.send_response(301)
            self.send_header('Location',destination)
            self.send_header('Cache-Control','no-store')
            self.end_headers()
            return
        if path!='/' and not path.endswith('/') and candidate.is_dir():
            self.send_response(301)
            self.send_header('Location',path+'/'+suffix)
            self.send_header('Cache-Control','no-store')
            self.end_headers()
            return
        if candidate.is_dir():candidate=candidate/'index.html'
        status=HTTPStatus.OK if candidate.is_file() else HTTPStatus.NOT_FOUND
        if status==HTTPStatus.NOT_FOUND:
            candidate=(ROOT/'404.html').resolve()
            if not candidate.is_file():return self.send_error(HTTPStatus.NOT_FOUND)
        data=candidate.read_bytes()
        media,_=mimetypes.guess_type(candidate.name)
        self.send_response(status)
        self.send_header('Content-Type',(media or 'application/octet-stream')+('; charset=utf-8' if media in ('text/html','text/css','application/javascript','text/plain','application/xml') else ''))
        self.send_header('Content-Length',str(len(data)))
        self.send_header('X-Content-Type-Options','nosniff')
        self.send_header('Referrer-Policy','strict-origin-when-cross-origin')
        self.send_header('Permissions-Policy','camera=(), microphone=(), geolocation=()')
        self.send_header('Cross-Origin-Resource-Policy','same-origin')
        self.send_header('X-Frame-Options','SAMEORIGIN')
        if not PRODUCTION:self.send_header('X-Robots-Tag','noindex, nofollow')
        inline=re.findall(rb'<script\b[^>]*>(.*?)</script>',data,re.DOTALL|re.IGNORECASE) if media=='text/html' else []
        hashes=["'sha256-"+base64.b64encode(hashlib.sha256(js).digest()).decode('ascii')+"'" for js in inline]
        csp="default-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'; form-action 'self'; connect-src 'self'; img-src 'self' data:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' "+' '.join(hashes)
        self.send_header('Content-Security-Policy',csp)
        self.send_header('Cache-Control','no-store' if media=='text/html' else 'public, max-age=3600')
        self.end_headers()
        if not head:self.wfile.write(data)

if __name__=='__main__':
    ap=argparse.ArgumentParser()
    ap.add_argument('--host',default='127.0.0.1')
    ap.add_argument('--port',type=int,default=8080)
    ap.add_argument('--export-leads',metavar='PRIVATE_OUTPUT_CSV')
    args=ap.parse_args()
    if args.export_leads:
        export_leads(args.export_leads)
    else:
        production_preflight()
        with db_connect():pass
        s=ThreadingHTTPServer((args.host,args.port),SiteHandler)
        print('Staging website: http://%s:%d/ (private lead DB: %s)' % (args.host,args.port,DB),flush=True)
        s.serve_forever()
