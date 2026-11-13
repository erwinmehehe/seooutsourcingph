<?php
declare(strict_types=1);

function sop_reply(int $status, array $data): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, private');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_SLASHES);
    exit;
}
function sop_config(): array {
    $private = dirname(__DIR__, 2) . '/sop-private';
    $path = $private . '/config.php';
    if (!is_file($path)) throw new RuntimeException('Missing private configuration');
    $c = require $path;
    if (!is_array($c) || empty($c['enabled']) || strlen($c['secret'] ?? '') < 32 || str_contains($c['secret'], 'REPLACE')) throw new RuntimeException('Incomplete configuration');
    if (!filter_var($c['recipient'] ?? '', FILTER_VALIDATE_EMAIL) || !filter_var($c['smtp_from'] ?? '', FILTER_VALIDATE_EMAIL)) throw new RuntimeException('Invalid email configuration');
    if (empty($c['smtp_host']) || empty($c['smtp_username']) || empty($c['smtp_password']) || !in_array($c['smtp_encryption'] ?? '', ['ssl','tls'], true)) throw new RuntimeException('Incomplete SMTP configuration');
    $origin = parse_url($c['origin'] ?? '');
    if (($origin['scheme'] ?? '') !== 'https' || empty($origin['host']) || !empty($origin['path'])) throw new RuntimeException('Invalid public origin');
    if (!is_file($private . '/vendor/autoload.php')) throw new RuntimeException('Missing mail dependencies');
    $c['private'] = $private;
    return $c;
}
function sop_session(array $c): void {
    if (strtolower($_SERVER['HTTP_HOST'] ?? '') !== strtolower(parse_url($c['origin'], PHP_URL_HOST))) sop_reply(400, ['ok'=>false,'error'=>'Invalid host.']);
    ini_set('session.use_strict_mode', '1');
    session_name('sop_session');
    session_set_cookie_params(['lifetime'=>0,'path'=>'/','secure'=>true,'httponly'=>true,'samesite'=>'Lax']);
    session_start();
    if (empty($_SESSION['csrf']) || ($_SESSION['issued'] ?? 0) < time()-3600) {
        session_regenerate_id(true);
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
        $_SESSION['issued'] = time();
    }
}
function sop_validate(array $d): array {
    if (!empty($d['phone_confirm']) || ($d['consent'] ?? false) !== true) throw new InvalidArgumentException('Please confirm consent and try again.');
    $limits = ['name'=>120,'email'=>254,'company'=>200,'website'=>2048,'details'=>6000,'audience'=>20,'plan'=>120];
    $p = [];
    foreach ($limits as $key=>$limit) {
        if (isset($d[$key]) && !is_string($d[$key])) throw new InvalidArgumentException('Invalid form field.');
        $p[$key] = trim($d[$key] ?? '');
        if (strlen($p[$key]) > $limit || str_contains($p[$key], "\0")) throw new InvalidArgumentException('A form field is too long or invalid.');
    }
    if (strlen($p['name']) < 2 || strlen($p['details']) < 10 || !filter_var($p['email'], FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $p['name'].$p['email'])) throw new InvalidArgumentException('Enter your name, a valid email and at least 10 characters about your requirements.');
    if (!in_array($p['audience'], ['agency','business'], true)) throw new InvalidArgumentException('Choose agency or business.');
    if ($p['website'] !== '' && (!filter_var($p['website'], FILTER_VALIDATE_URL) || !in_array(parse_url($p['website'], PHP_URL_SCHEME), ['http','https'], true))) throw new InvalidArgumentException('Enter a website starting with https:// or http://.');
    return $p;
}
// One exclusive lock covers quota and record creation. No raw IP addresses are stored.
function sop_store(array $c, array $payload, string $ip): string {
    $dir = $c['private'].'/enquiries';
    if (!is_dir($dir) && !mkdir($dir,0700,true)) throw new RuntimeException('Storage unavailable');
    $lock = fopen($dir.'/.lock','c');
    if (!$lock || !flock($lock,LOCK_EX)) throw new RuntimeException('Storage unavailable');
    try {
        $hash = hash_hmac('sha256',$ip,$c['secret']); $recent = 0;
        foreach (glob($dir.'/*.json') ?: [] as $file) {
            $row = json_decode((string)file_get_contents($file),true);
            if (!is_array($row)) throw new RuntimeException('Invalid saved record');
            if (($row['created'] ?? 0) < time()-max(1,(int)($c['retention_days'] ?? 90))*86400) { unlink($file); continue; }
            if (($row['ip_hash'] ?? '') === $hash && ($row['created'] ?? 0) > time()-1800) $recent++;
        }
        if ($recent >= 3) throw new OverflowException('Too many requests. Please try again in 30 minutes.');
        $ref='SEO-'.gmdate('Ymd').'-'.strtoupper(bin2hex(random_bytes(4)));
        $row=['reference'=>$ref,'created'=>time(),'ip_hash'=>$hash,'payload'=>$payload,'notification'=>'pending','attempts'=>0];
        sop_save($dir.'/'.$ref.'.json',$row);
        return $ref;
    } finally { flock($lock,LOCK_UN); fclose($lock); }
}
function sop_save(string $file,array $row): void {
    $temp=$file.'.tmp-'.bin2hex(random_bytes(4));
    $body=json_encode($row,JSON_THROW_ON_ERROR|JSON_UNESCAPED_SLASHES);
    if (file_put_contents($temp,$body,LOCK_EX) !== strlen($body)) throw new RuntimeException('Could not save enquiry');
    chmod($temp,0600);
    if (!rename($temp,$file)) { @unlink($temp); throw new RuntimeException('Could not save enquiry'); }
}
function sop_notify(array $c,string $reference): bool {
    require_once $c['private'].'/vendor/autoload.php';
    $dir=$c['private'].'/enquiries';
    $lock=fopen($dir.'/.lock','c');
    if (!$lock || !flock($lock,LOCK_EX)) return false;
    try {
        $file=$dir.'/'.$reference.'.json';
        $row=json_decode((string)file_get_contents($file),true,512,JSON_THROW_ON_ERROR);
        if ($row['notification']==='smtp_accepted') return true;
        if ($row['attempts']>=5) return false;
        $row['attempts']++; $row['last_attempt']=time();
        // Persist attempt before network work so a timeout cannot create unlimited retries.
        sop_save($file,$row);
        $mail=new PHPMailer\PHPMailer\PHPMailer(true);
        try {
            $mail->isSMTP(); $mail->Host=$c['smtp_host']; $mail->Port=(int)$c['smtp_port'];
            $mail->SMTPAuth=true; $mail->Username=$c['smtp_username']; $mail->Password=$c['smtp_password'];
            $mail->SMTPSecure=$c['smtp_encryption']; $mail->Timeout=10; $mail->CharSet='UTF-8';
            $mail->setFrom($c['smtp_from'],'SEO Outsourcing Philippines'); $mail->addAddress($c['recipient']);
            $mail->addReplyTo($row['payload']['email'],$row['payload']['name']);
            $mail->Subject='SEO quote request '.$reference;
            $mail->Body="Reference: $reference\n\n";
            foreach ($row['payload'] as $key=>$value) $mail->Body.=ucfirst($key).": $value\n\n";
            $mail->send(); $row['notification']='smtp_accepted';
        } catch (Throwable $e) { $row['notification']='failed'; error_log('SOP mail notification failed: '.$reference); }
        sop_save($file,$row);
        return $row['notification']==='smtp_accepted';
    } finally { flock($lock,LOCK_UN); fclose($lock); }
}
