<?php
// Run only from hPanel cron/SSH after testing and reviewing the live content.
declare(strict_types=1);
if (PHP_SAPI!=='cli') { http_response_code(404); exit; }
require dirname(__DIR__).'/public_html/api/common.php';
sop_config();
if (($argv[1] ?? '')!=='--publish') { fwrite(STDERR,"Usage: php publish.php --publish\n"); exit(1); }
$root=dirname(__DIR__).'/public_html';
$pages=json_decode(file_get_contents(__DIR__.'/pages.json'),true,512,JSON_THROW_ON_ERROR);
foreach (array_merge($pages,['/404.html']) as $url) {
    $file=$root.($url==='/404.html' ? '/404.html' : $url.'index.html');
    $html=file_get_contents($file);
    if ($url!=='/404.html') {
        $html=preg_replace_callback('/<meta\b[^>]*>/i',function($m) {
            return preg_match('/\bname\s*=\s*[\x22\x27]robots[\x22\x27]/i',$m[0]) ? '<meta name="robots" content="index,follow,max-image-preview:large"/>' : $m[0];
        },$html);
        if (file_put_contents($file,$html)===false) throw new RuntimeException('Cannot write page');
    }
}
$xml='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
foreach ($pages as $url) $xml.='<url><loc>https://seooutsourcingphilippines.com'.htmlspecialchars($url,ENT_XML1).'</loc></url>';
$xml.='</urlset>';
file_put_contents($root.'/sitemap.xml',$xml);
file_put_contents($root.'/robots.txt',"User-agent: *\nAllow: /\nSitemap: https://seooutsourcingphilippines.com/sitemap.xml\n");
echo "Indexing enabled for ".count($pages)." pages. Submit /sitemap.xml in Search Console.\n";
