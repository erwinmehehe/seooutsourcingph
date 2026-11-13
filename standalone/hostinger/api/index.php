<?php
declare(strict_types=1);
require __DIR__.'/common.php';
try {
    $c=sop_config();
    $route=parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH);
    $method=$_SERVER['REQUEST_METHOD'];
    if ($route==='/api/health' && $method==='GET') sop_reply(200,['ok'=>true]);
    if (!in_array($route,['/api/session','/api/inquiry'],true)) sop_reply(404,['ok'=>false,'error'=>'Not found.']);
    if (($route==='/api/session' && $method!=='GET') || ($route==='/api/inquiry' && $method!=='POST')) sop_reply(405,['ok'=>false,'error'=>'Method not allowed.']);
    sop_session($c);
    if ($route==='/api/session') sop_reply(200,['csrf_token'=>$_SESSION['csrf']]);
    if (($_SERVER['HTTP_ORIGIN'] ?? '') !== $c['origin']) sop_reply(403,['ok'=>false,'error'=>'Invalid request origin.']);
    if (!str_starts_with(strtolower($_SERVER['CONTENT_TYPE'] ?? ''),'application/json')) sop_reply(415,['ok'=>false,'error'=>'JSON required.']);
    $raw=file_get_contents('php://input',false,null,0,12001);
    if (strlen($raw)>12000) sop_reply(413,['ok'=>false,'error'=>'Request is too large.']);
    $d=json_decode($raw,true,32,JSON_THROW_ON_ERROR);
    if (!is_array($d)) throw new InvalidArgumentException('Invalid form data.');
    if (!is_string($d['csrf_token'] ?? null) || !hash_equals($_SESSION['csrf'],$d['csrf_token'])) sop_reply(403,['ok'=>false,'error'=>'Your form session expired. Refresh and try again.']);
    $payload=sop_validate($d);
    $reference=sop_store($c,$payload,$_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $_SESSION['csrf']=bin2hex(random_bytes(32));
    session_write_close();
    try { sop_notify($c,$reference); } catch (Throwable $e) { error_log('SOP notification requires retry: '.$reference); }
    sop_reply(201,['ok'=>true,'reference'=>$reference]);
} catch (OverflowException $e) { sop_reply(429,['ok'=>false,'error'=>$e->getMessage()]);
} catch (InvalidArgumentException|JsonException $e) { sop_reply(400,['ok'=>false,'error'=>'Check your form fields and try again.']);
} catch (Throwable $e) { error_log('SOP form service unavailable'); sop_reply(503,['ok'=>false,'error'=>'The quote form is temporarily unavailable. Please email info@seooutsourcingphilippines.com.']); }
