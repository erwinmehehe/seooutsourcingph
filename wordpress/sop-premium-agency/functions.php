<?php
if (!defined('ABSPATH')) exit;
add_action('after_setup_theme', static function () {
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_theme_support('html5', array('search-form','gallery','caption','style','script'));
});
add_action('wp_enqueue_scripts', static function () {
  wp_enqueue_style('sop-site', get_template_directory_uri().'/assets/site.css', array(), '1.0.0');
  wp_enqueue_script('sop-site', get_template_directory_uri().'/assets/site.js', array(), '1.0.0', true);
});
// Full-layout imported pages contain real HTML headings/sections; do not autowrap HTML in paragraphs.
add_action('wp', static function () {
  if (is_singular() && get_post_meta(get_queried_object_id(), '_sop_full_layout', true) === '1') {
    remove_filter('the_content','wpautop');
  }
});
add_filter('the_content', static function ($html) {
  if (!is_singular() || get_post_meta(get_the_ID(), '_sop_full_layout', true) !== '1') return $html;
  // Turn root-relative page paths into correct staging or production URLs.
  return preg_replace_callback('/(href|src)="(\/[^"]+)"/', static function ($m) {
    // Shared site resources are bundled with this theme, not in the WordPress document root.
    $url = str_starts_with($m[2], '/assets/')
      ? get_template_directory_uri() . $m[2]
      : home_url($m[2]);
    return $m[1].'="'.esc_url($url).'"';
  }, $html);
}, 20);
add_shortcode('sop_resource', static function ($atts, $content = '') {
  $atts = shortcode_atts(array('file'=>''),$atts,'sop_resource');
  $file = sanitize_file_name($atts['file']);
  if (!preg_match('/^[a-z0-9_\-]+\.csv$/', $file)) return '';
  return '<a href="'.esc_url(get_template_directory_uri().'/assets/resources/'.$file).'" download>'.esc_html($content ?: 'Download resource').'</a>';
});
// The custom import retains explicit HTML headings. Editors can use the code editor for these pages.
add_filter('body_class', static function($classes){ $classes[]='sop-theme'; return $classes; });
// WordPress core generates canonical links. SEO plugin integration must be checked to avoid duplicates.

add_filter('wp_robots', static function ($robots) {
  if (is_singular() && get_post_meta(get_queried_object_id(), '_sop_full_layout', true) === '1' && get_post_meta(get_queried_object_id(), 'sop_release_status', true) !== 'APPROVED') {
    $robots['noindex'] = true;
    $robots['nofollow'] = true;
  }
  return $robots;
});
add_action('wp_head', static function () {
  if (!is_singular() || defined('WPSEO_VERSION') || defined('RANK_MATH_VERSION')) return;
  $desc = get_post_meta(get_queried_object_id(), '_yoast_wpseo_metadesc', true);
  if ($desc) echo '<meta name="description" content="'.esc_attr($desc).'">' . "\n";
}, 5);
