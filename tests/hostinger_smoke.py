"""PHP HTTP + real TLS SMTP integration. Only synthetic local enquiry data is used."""
import http.client,json,os,shutil,socket,socketserver,ssl,subprocess,sys,tempfile,threading,time
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
PHP=os.environ.get('PHP_BIN') or shutil.which('php')
OPENSSL=os.environ.get('OPENSSL_BIN') or shutil.which('openssl')
assert PHP and OPENSSL,'Set PHP_BIN and OPENSSL_BIN'
messages=[]
class SMTP(socketserver.StreamRequestHandler):
 def handle(self):
  self.wfile.write(b'220 localhost test SMTP\r\n');state=0;body=[];data=False
  while line:=self.rfile.readline():
   if data:
    if line==b'.\r\n':messages.append(b''.join(body));data=False;self.wfile.write(b'250 queued\r\n')
    else:body.append(line)
   elif state:
    state+=1
    if state==3:state=0;self.wfile.write(b'235 authenticated\r\n')
    else:self.wfile.write(b'334 UGFzc3dvcmQ6\r\n')
   elif line.upper().startswith(b'EHLO'):self.wfile.write(b'250-localhost\r\n250 AUTH LOGIN\r\n')
   elif line.upper().startswith(b'AUTH LOGIN'):state=1;self.wfile.write(b'334 VXNlcm5hbWU6\r\n')
   elif line.upper().startswith(b'DATA'):data=True;self.wfile.write(b'354 end with dot\r\n')
   elif line.upper().startswith(b'QUIT'):self.wfile.write(b'221 bye\r\n');return
   else:self.wfile.write(b'250 OK\r\n')

def main():
 with tempfile.TemporaryDirectory() as tmp:
  base=Path(tmp);pub=base/'public_html';private=base/'sop-private';pub.mkdir();private.mkdir()
  src=ROOT/'standalone/hostinger';shutil.copytree(src/'api',pub/'api');shutil.copytree(src/'vendor',private/'vendor')
  cert=base/'cert.pem';key=base/'key.pem'
  subprocess.run([OPENSSL,'req','-x509','-newkey','rsa:2048','-nodes','-days','1','-keyout',str(key),'-out',str(cert),'-subj','/CN=localhost','-addext','subjectAltName=DNS:localhost'],check=True,capture_output=True)
  smtp=socketserver.ThreadingTCPServer(('127.0.0.1',0),SMTP);ctx=ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER);ctx.load_cert_chain(cert,key)
  smtp.socket=ctx.wrap_socket(smtp.socket,server_side=True);threading.Thread(target=smtp.serve_forever,daemon=True).start()
  config=(src/'config.example.php').read_text().replace("'enabled' => false","'enabled' => true").replace('REPLACE_WITH_64_RANDOM_HEX_CHARACTERS','a'*64).replace("'smtp_host' => ''","'smtp_host' => 'localhost'").replace("'smtp_port' => 465",f"'smtp_port' => {smtp.server_address[1]}").replace("'smtp_username' => ''","'smtp_username' => 'local-test'").replace("'smtp_password' => ''","'smtp_password' => 'local-test'").replace("'smtp_from' => ''","'smtp_from' => 'test@example.com'")
  (private/'config.php').write_text(config)
  with socket.socket() as s:s.bind(('127.0.0.1',0));port=s.getsockname()[1]
  router=base/'router.php';router.write_text('<?php require __DIR__."/public_html/api/index.php";')
  command=[PHP,'-d','extension_dir='+str(Path(PHP).parent/'ext'),'-d','extension=openssl','-d','openssl.cafile='+str(cert),'-S',f'127.0.0.1:{port}',str(router)] if os.name=='nt' else [PHP,'-d','openssl.cafile='+str(cert),'-S',f'127.0.0.1:{port}',str(router)]
  log=open(base/'php.log','w');proc=subprocess.Popen(command,stdout=log,stderr=log)
  cookie=''
  def request(method,path,data=None,origin='https://seooutsourcingphilippines.com'):
   nonlocal cookie
   conn=http.client.HTTPConnection('127.0.0.1',port,timeout=20)
   headers={'Host':'seooutsourcingphilippines.com','Origin':origin,'Content-Type':'application/json'}
   if cookie:headers['Cookie']=cookie
   conn.request(method,path,json.dumps(data) if data is not None else None,headers);r=conn.getresponse();raw=r.read()
   if r.getheader('Set-Cookie'):cookie=r.getheader('Set-Cookie').split(';')[0]
   result=(r.status,json.loads(raw));conn.close();return result
  try:
   for _ in range(50):
    try:assert request('GET','/api/health')[0]==200;break
    except (ConnectionError,OSError):time.sleep(.1)
   token=request('GET','/api/session')[1]['csrf_token']
   d={'csrf_token':token,'name':'Local Test','email':'customer@example.com','website':'https://example.com','audience':'business','plan':'SEO Essential','details':'Synthetic integration test request.','consent':True}
   assert request('POST','/api/inquiry',d,origin='https://other.example')[0]==403
   assert request('POST','/api/inquiry',dict(d,csrf_token='invalid'))[0]==403
   assert request('POST','/api/inquiry',dict(d,consent=False))[0]==400
   assert request('POST','/api/inquiry',dict(d,phone_confirm='bot'))[0]==400
   assert request('POST','/api/inquiry',dict(d,email='x\r\nBcc: evil@example.com'))[0]==400
   assert request('POST','/api/inquiry',dict(d,website='javascript:alert(1)'))[0]==400
   assert request('POST','/api/inquiry',dict(d,details='x'*13000))[0]==413
   code,result=request('POST','/api/inquiry',d);assert code==201,(code,result)
   saved=private/'enquiries'/(result['reference']+'.json');row=json.loads(saved.read_text())
   assert row['notification']=='smtp_accepted',row
   assert len(messages)==1 and b'Reply-To: Local Test <customer@example.com>' in messages[0]
   assert request('POST','/api/inquiry',d)[0]==403 # consumed token
   # Force SMTP connection failure; request must still be durably saved.
   (private/'config.php').write_text(config.replace(f"'smtp_port' => {smtp.server_address[1]}","'smtp_port' => 1"))
   d['csrf_token']=request('GET','/api/session')[1]['csrf_token'];code,result=request('POST','/api/inquiry',d);assert code==201
   failed=private/'enquiries'/(result['reference']+'.json');assert json.loads(failed.read_text())['notification']=='failed'
   (private/'config.php').write_text(config)
   retry=base/'retry.php';retry.write_text('<?php require __DIR__."/public_html/api/common.php"; exit(sop_notify(sop_config(),'+json.dumps(result['reference'])+') ? 0 : 1);')
   cli=command[:command.index('-S')]
   subprocess.run(cli+[str(retry)],check=True,capture_output=True)
   assert json.loads(failed.read_text())['notification']=='smtp_accepted' and len(messages)==2
   d['csrf_token']=request('GET','/api/session')[1]['csrf_token'];assert request('POST','/api/inquiry',d)[0]==201
   d['csrf_token']=request('GET','/api/session')[1]['csrf_token'];assert request('POST','/api/inquiry',d)[0]==429
   assert len(list((private/'enquiries').glob('*.json')))==3
   # Verify CLI-only publication writes real-domain discovery and page robots.
   shutil.copy2(src/'publish.php',private/'publish.php');(private/'pages.json').write_text('["/"]')
   (pub/'index.html').write_text('<head><meta content="noindex,nofollow" name="robots"/></head>');(pub/'404.html').write_text('Not found')
   subprocess.run(cli+[str(private/'publish.php'),'--publish'],check=True,capture_output=True)
   assert 'noindex' not in (pub/'index.html').read_text() and 'Sitemap: https://seooutsourcingphilippines.com/sitemap.xml' in (pub/'robots.txt').read_text()
   print('PASS: PHP HTTP session/CSRF, origin, validation, consent, honeypot, request limits, private persistence, TLS SMTP, failed-mail recovery, rate limit and publication.')
  finally:proc.terminate();proc.wait(timeout=10);log.close();smtp.shutdown();smtp.server_close()

if __name__=='__main__':main()
