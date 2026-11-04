<?php
/**
 * Plugin Name: SOP Case Studies (Approval Controlled)
 * Plugin URI: https://seooutsourcingphilippines.com/
 * Description: Adds searchable, permission-controlled SEO case studies. Never publishes unapproved client proof or testimonials.
 * Version: 1.0.0
 * Requires PHP: 8.1
 * Text Domain: sop-case-studies
 */
if (!defined('ABSPATH')) exit;

function sop_cases_register(): void {
    register_post_type('sop_case', [
        'labels'=>['name'=>'SEO Case Studies','singular_name'=>'SEO Case Study','add_new_item'=>'Add SEO Case Study','edit_item'=>'Edit SEO Case Study'],
        'public'=>true, 'show_in_rest'=>true, 'menu_icon'=>'dashicons-chart-line',
        'has_archive'=>true, 'rewrite'=>['slug'=>'case-studies','with_front'=>false],
        'supports'=>['title','editor','excerpt','thumbnail','revisions'], 'show_in_nav_menus'=>true
    ]);
    register_taxonomy('sop_case_sector', ['sop_case'], [
        'label'=>'Industry', 'public'=>true, 'show_in_rest'=>true, 'hierarchical'=>true,
        'rewrite'=>['slug'=>'case-study-industry']
    ]);
    register_taxonomy('sop_case_outcome', ['sop_case'], [
        'label'=>'Outcome', 'public'=>true, 'show_in_rest'=>true, 'hierarchical'=>true,
        'rewrite'=>['slug'=>'case-study-outcome']
    ]);
    register_post_meta('sop_case', '_sop_case_permission', [
        'single'=>true, 'type'=>'string', 'default'=>'no', 'show_in_rest'=>false,
        'auth_callback'=>static function(){return current_user_can('edit_posts');}
    ]);
}
add_action('init', 'sop_cases_register');
register_activation_hook(__FILE__, static function () {
    sop_cases_register();
    foreach (['B2B SaaS','Legal','E-commerce','Local Services'] as $name) if (!term_exists($name,'sop_case_sector')) wp_insert_term($name,'sop_case_sector');
    foreach (['Organic traffic','Search visibility','Qualified enquiries','Technical recovery'] as $name) if (!term_exists($name,'sop_case_outcome')) wp_insert_term($name,'sop_case_outcome');
    flush_rewrite_rules();
});
register_deactivation_hook(__FILE__, 'flush_rewrite_rules');

add_action('add_meta_boxes_sop_case', static function():void {
    add_meta_box('sop-proof-approval','Evidence and permission', 'sop_cases_permission_box','sop_case','side','high');
    add_meta_box('sop-proof-metrics','Documented results','sop_cases_results_box','sop_case','normal','high');
});
function sop_cases_permission_box($post):void {
    wp_nonce_field('sop_cases_save','sop_cases_nonce');
    $approved=get_post_meta($post->ID,'_sop_case_permission',true)==='yes';
    $quote=get_post_meta($post->ID,'_sop_quote_permission',true)==='yes';
    echo '<p>Only mark approved after written client permission, verified attribution and reviewed evidence are on file.</p>';
    echo '<p><label><input type="checkbox" name="sop_case_permission" value="yes" '.checked($approved,true,false).'> Client permission and proof reviewed</label></p>';
    echo '<p><label><input type="checkbox" name="sop_quote_permission" value="yes" '.checked($quote,true,false).'> Testimonial permission on file</label></p>';
    echo '<p><strong>Unapproved case studies are forcibly saved as drafts.</strong></p>';
}
function sop_cases_results_box($post):void {
    $fields=['_sop_challenge'=>'Challenge','_sop_execution'=>'Technical execution','_sop_results'=>'Verified result and measurement window','_sop_source'=>'Public supporting source URL','_sop_quote'=>'Authorized client quote'];
    echo '<p>Do not enter identifying client details or private dashboard URLs without approval.</p>';
    foreach($fields as $key=>$label){
      $value=get_post_meta($post->ID,$key,true);
      echo '<p><label for="'.esc_attr($key).'"><strong>'.esc_html($label).'</strong></label><br>';
      if($key==='_sop_source') echo '<input class="widefat" type="url" name="'.esc_attr($key).'" id="'.esc_attr($key).'" value="'.esc_attr($value).'">';
      else echo '<textarea class="widefat" rows="3" name="'.esc_attr($key).'" id="'.esc_attr($key).'">'.esc_textarea($value).'</textarea>';
      echo '</p>';
    }
}
add_action('save_post_sop_case', static function(int $post_id):void {
    if (!isset($_POST['sop_cases_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['sop_cases_nonce'])),'sop_cases_save')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post',$post_id)) return;
    update_post_meta($post_id,'_sop_case_permission', isset($_POST['sop_case_permission']) && $_POST['sop_case_permission']==='yes'?'yes':'no');
    update_post_meta($post_id,'_sop_quote_permission', isset($_POST['sop_quote_permission']) && $_POST['sop_quote_permission']==='yes'?'yes':'no');
    foreach (['_sop_challenge','_sop_execution','_sop_results','_sop_source','_sop_quote'] as $key){
       if (!isset($_POST[$key])) continue;
       $value=wp_unslash($_POST[$key]);
       update_post_meta($post_id,$key,$key==='_sop_source'?esc_url_raw($value):sanitize_textarea_field($value));
    }
},10,1);

// For post editor and REST uploads, a published entry requires stored prior permission
// or a permission confirmation in this exact editor save action.
add_filter('wp_insert_post_data', static function(array $data,array $postarr):array {
    if (($data['post_type'] ?? '')!=='sop_case' || ($data['post_status'] ?? '')!=='publish') return $data;
    $id=(int)($postarr['ID']??0);
    $approved=$id && get_post_meta($id,'_sop_case_permission',true)==='yes';
    $confirmed=!empty($_POST['sop_case_permission']) && $_POST['sop_case_permission']==='yes'
       && !empty($_POST['sop_cases_nonce'])
       && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['sop_cases_nonce'])),'sop_cases_save');
    if (!$approved && !$confirmed) $data['post_status']='draft';
    return $data;
},10,2);

add_action('template_redirect',static function():void {
    if (!is_singular('sop_case')) return;
    if (get_post_meta(get_queried_object_id(),'_sop_case_permission',true)==='yes') return;
    if (current_user_can('edit_post',get_queried_object_id())) return;
    status_header(404);nocache_headers();wp_die('Unapproved case study.','Not available',['response'=>404]);
});

// Exclude unapproved case studies from default WP XML sitemap and public archive queries.
add_filter('wp_sitemaps_posts_query_args',static function($args,$post_type){
    if($post_type!=='sop_case')return $args;
    $args['meta_query']=[['key'=>'_sop_case_permission','value'=>'yes','compare'=>'=']];
    return $args;
},20,2);
add_action('pre_get_posts',static function($query):void {
    if(is_admin()||!$query->is_main_query()||!$query->is_post_type_archive('sop_case'))return;
    $query->set('meta_query',[['key'=>'_sop_case_permission','value'=>'yes']]);
    $sector=isset($_GET['sector'])?sanitize_title(wp_unslash($_GET['sector'])):'';
    $outcome=isset($_GET['outcome'])?sanitize_title(wp_unslash($_GET['outcome'])):'';
    $tax=[];
    if($sector && term_exists($sector,'sop_case_sector'))$tax[]=['taxonomy'=>'sop_case_sector','field'=>'slug','terms'=>$sector];
    if($outcome && term_exists($outcome,'sop_case_outcome'))$tax[]=['taxonomy'=>'sop_case_outcome','field'=>'slug','terms'=>$outcome];
    if($tax)$query->set('tax_query',count($tax)>1?array_merge(['relation'=>'AND'],$tax):$tax);
});
