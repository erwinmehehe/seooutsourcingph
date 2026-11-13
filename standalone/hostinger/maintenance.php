<?php
// CLI only. Place in sop-private beside config.php; run via Hostinger cron.
declare(strict_types=1);
if (PHP_SAPI!=='cli') { http_response_code(404); exit; }
require dirname(__DIR__).'/public_html/api/common.php';
$c=sop_config(); $failed=0;
foreach (glob($c['private'].'/enquiries/*.json') ?: [] as $file) {
    $row=json_decode((string)file_get_contents($file),true);
    if (!is_array($row)) { $failed++; continue; }
    if ($row['created'] < time()-max(1,(int)$c['retention_days'])*86400) {
        $lock=fopen(dirname($file).'/.lock','c');
        if ($lock && flock($lock,LOCK_EX)) { if (is_file($file)) unlink($file); flock($lock,LOCK_UN); fclose($lock); }
        continue;
    }
    if ($row['notification']!=='smtp_accepted' && ($row['last_attempt'] ?? 0)<time()-300) {
        if (!sop_notify($c,$row['reference'])) $failed++;
    }
}
echo "Pending or exhausted notifications: $failed\n";
exit($failed ? 1 : 0);
