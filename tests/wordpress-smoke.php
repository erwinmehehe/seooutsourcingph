<?php
// Run in an isolated WordPress installation: wp eval-file tests/wordpress-smoke.php.
function sop_assert($condition, $message) { if (!$condition) throw new RuntimeException($message); }
$type = get_post_type_object('sop_inquiry');
sop_assert($type && !$type->public && !$type->show_in_rest && $type->exclude_from_search, 'Enquiries must remain private.');
wp_set_current_user(1);
$form = do_shortcode('[sop_proposal_form]');
sop_assert(strpos($form,'sop_nonce') !== false && strpos($form,'admin-post.php') !== false, 'WordPress quote form is not connected.');
$id = wp_insert_post(array('post_type'=>'sop_inquiry','post_status'=>'private','post_title'=>'QA-ONLY',
 'post_content'=>'Synthetic integration test. No response required.',
 'meta_input'=>array('_sop_reply_to'=>'qa@example.com','_sop_subject'=>'QA ONLY','_sop_notification_status'=>'pending','_sop_notification_attempts'=>0)));
sop_assert($id && !is_wp_error($id), 'Enquiry storage failed.');
$fail = static function () { return false; };
add_filter('pre_wp_mail',$fail);
sop_pf_notify_inquiry($id);
sop_assert(get_post_meta($id,'_sop_notification_status',true)==='failed','Failed mail must be recorded.');
sop_assert(wp_next_scheduled('sop_pf_retry_notification',array($id)) !== false,'Failed mail must be retried.');
remove_filter('pre_wp_mail',$fail);
$accept = static function () { return true; };
add_filter('pre_wp_mail',$accept);
sop_pf_notify_inquiry($id);
sop_assert(get_post_meta($id,'_sop_notification_status',true)==='accepted','Retry must update notification state.');
remove_filter('pre_wp_mail',$accept);
wp_set_current_user(0);
sop_assert(!current_user_can('read_post',$id), 'Public users must not access enquiries.');
wp_set_current_user(1);
sop_assert(current_user_can('read_post',$id), 'Administrators need enquiry access.');
$old = wp_insert_post(array('post_type'=>'sop_inquiry','post_status'=>'private','post_title'=>'OLD QA ONLY',
 'post_date'=>'2000-01-01 00:00:00','post_date_gmt'=>'2000-01-01 00:00:00'));
do_action('sop_pf_retention');
sop_assert(get_post($old)===null,'Expired enquiries must be removed.');
wp_delete_post($id,true);
$home = wp_insert_post(array('post_type'=>'page','post_status'=>'publish','post_title'=>'Home','post_name'=>'home',
 'meta_input'=>array('_sop_full_layout'=>'1','sop_release_status'=>'APPROVED')));
update_option('show_on_front','page');update_option('page_on_front',$home);
$GLOBALS['wp_query'] = new WP_Query(array('page_id'=>$home));
ob_start();include get_template_directory().'/front-page.php';$markup=ob_get_clean();
sop_assert(strpos($markup,'Organic search performance')!==false,'Original hero is missing.');
sop_assert(strpos($markup,'name="sop-quote-url"')!==false,'WordPress quote route is missing.');
sop_assert(substr_count($markup,'<h1')===1,'Homepage must have exactly one H1.');
$robots=apply_filters('robots_txt',"User-agent: *\nSitemap: https://temporary.hostingersite.com/sitemap.xml\n",true);
sop_assert(strpos($robots,'hostingersite.com')===false,'Temporary sitemap domain remains.');
sop_assert(strpos($robots,'Sitemap: https://seooutsourcingphilippines.com/wp-sitemap.xml')!==false,'Production sitemap discovery is incorrect.');
update_post_meta($home,'sop_release_status','HOLD');$robots=apply_filters('wp_robots',array());
sop_assert(!empty($robots['noindex']),'Held imported pages must remain noindex.');
echo "WordPress homepage, form storage, notification recovery and privacy checks passed.\n";
