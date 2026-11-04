<?php
/**
 * Optional one-time WP-CLI page bootstrap. Run ONLY on backed-up staging:
 * wp eval-file wp-content/themes/sop-blocksy-agency/scripts/bootstrap-drafts.php
 * Creates drafts only, never publishes, updates, or deletes existing pages.
 */
if (!defined('ABSPATH') || !defined('WP_CLI') || !WP_CLI) {
    exit("Run with WP-CLI on staging only.\n");
}
function sop_bootstrap_draft(string $slug,string $title,int $parent=0): int {
    $path=$parent?get_post_field('post_name',$parent).'/'.$slug:$slug;
    $existing=get_page_by_path($path,OBJECT,'page');
    if($existing){WP_CLI::log('Exists: '.$path.' (unchanged)');return (int)$existing->ID;}
    $id=wp_insert_post(['post_type'=>'page','post_status'=>'draft','post_name'=>$slug,
        'post_title'=>$title,'post_parent'=>$parent,'post_content'=>''],true);
    if(is_wp_error($id)){WP_CLI::warning('Skipped '.$path.': '.$id->get_error_message());return 0;}
    WP_CLI::log('Created DRAFT: '.$path);return (int)$id;
}
$pages=[
    'home'=>'Home','services'=>'Services','about'=>'About','pricing'=>'Pricing',
    'for-agencies'=>'For Agencies','for-businesses'=>'For Businesses',
    'contact'=>'Contact','book-discovery-call'=>'Book Discovery Call',
    'how-it-works'=>'How It Works','results'=>'Results','samples'=>'Work Samples',
    'talent'=>'SEO Talent','blog'=>'Blog'
];
$service_parent=0;
foreach($pages as $slug=>$title){
  $id=sop_bootstrap_draft($slug,$title);
  if($slug==='services')$service_parent=$id;
}
if($service_parent){
  foreach(sop_agency_services() as $slug=>$entry){
     sop_bootstrap_draft($slug,$entry['title'].' Outsourcing',$service_parent);
  }
}
WP_CLI::success('Draft scaffolding complete. No pages published or approved. Assign the static home and posts page manually after reviewing URL mapping.');
