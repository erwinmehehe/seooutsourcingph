<?php
if (!defined('ABSPATH')) exit;
add_action('after_setup_theme', static function () {
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_theme_support('html5', array('search-form','gallery','caption','style','script'));
});
add_action('wp_enqueue_scripts', static function () {
  $uri = get_template_directory_uri();
  $path = get_template_directory();
  if (is_front_page()) {
    wp_enqueue_style('sop-homepage', $uri.'/assets/homepage.css', array(), filemtime($path.'/assets/homepage.css'));
    wp_enqueue_script('sop-homepage', $uri.'/assets/homepage.js', array(), filemtime($path.'/assets/homepage.js'), true);
  } else {
    wp_enqueue_style('sop-site', $uri.'/assets/site.css', array(), filemtime($path.'/assets/site.css'));
    wp_enqueue_style('sop-page-shell', $uri.'/assets/page-shell.css', array('sop-site'), filemtime($path.'/assets/page-shell.css'));
    wp_enqueue_style('sop-inner-pages', $uri.'/assets/inner-pages.css', array('sop-page-shell'), filemtime($path.'/assets/inner-pages.css'));
    wp_enqueue_script('sop-site', $uri.'/assets/site.js', array(), filemtime($path.'/assets/site.js'), true);
    wp_enqueue_script('sop-measurement', $uri.'/assets/measurement.js', array(), filemtime($path.'/assets/measurement.js'), true);
  }
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
  if (is_front_page() || !is_singular() || defined('WPSEO_VERSION') || defined('RANK_MATH_VERSION')) return;
  $desc = get_post_meta(get_queried_object_id(), '_yoast_wpseo_metadesc', true);
  if ($desc) echo '<meta name="description" content="'.esc_attr($desc).'">' . "\n";
}, 5);


/**
 * Publication guard for imported full-layout content only. It does not affect
 * pre-existing WordPress pages. Accidentally publishing a draft will not expose
 * unapproved client examples, legal drafts or regulated-sector copy.
 */
add_action('template_redirect', static function () {
  if (!is_singular()) return;
  $id = get_queried_object_id();
  if (get_post_meta($id, '_sop_full_layout', true) !== '1') return;
  if (get_post_meta($id, 'sop_release_status', true) === 'APPROVED') return;
  if (current_user_can('edit_post', $id)) return; // Authenticated editor review remains possible.
  status_header(404);
  nocache_headers();
  wp_die('This page is not available.', 'Page unavailable', array('response' => 404));
});
/* Exclude held imported pages from WordPress core XML post/page sitemaps. */
add_filter('wp_sitemaps_posts_query_args', static function ($args, $post_type) {
  if (!in_array($post_type, array('page','post'), true)) return $args;
  $args['meta_query'] = array(
    'relation' => 'OR',
    array('key' => '_sop_full_layout', 'compare' => 'NOT EXISTS'),
    array('relation' => 'AND',
      array('key' => '_sop_full_layout', 'value' => '1', 'compare' => '='),
      array('key' => 'sop_release_status', 'value' => 'APPROVED', 'compare' => '=')
    )
  );
  return $args;
}, 20, 2);

// Replace imported static contact forms with the server-side WordPress form.
add_filter('the_content', static function ($html) {
  if (!is_page('contact')) return $html;
  $form = shortcode_exists('sop_proposal_form') ? do_shortcode('[sop_proposal_form]') : '<p>The quote form is temporarily unavailable. Email <a href="mailto:info@seooutsourcingphilippines.com">info@seooutsourcingphilippines.com</a>.</p>';
  $html = str_replace('[sop_proposal_form]', $form, $html);
  return preg_replace('/<div class="form-wrap"[^>]*><form\b[\s\S]*?<\/form><\/div>/', $form, $html, 1);
}, 9);

// Keep sitemap discovery on the configured production domain, never a preview hostname.
add_filter('robots_txt', static function ($output, $public) {
  if (!$public || !in_array(wp_parse_url(home_url('/'), PHP_URL_HOST), array('seooutsourcingphilippines.com','www.seooutsourcingphilippines.com'), true)) return "User-agent: *\nDisallow: /\n";
  $output = preg_replace('/^Sitemap:.*$/mi', '', $output);
  $endpoint = (defined('WPSEO_VERSION') || defined('RANK_MATH_VERSION')) ? '/sitemap_index.xml' : '/wp-sitemap.xml';
  return rtrim($output)."\nSitemap: ".home_url($endpoint, 'https')."\n";
}, 99, 2);

// Homepage copy comes from the theme build, not stale imported SEO fields.
function sop_home_description() { return 'Scale your search rankings with SEO Outsourcing Philippines. Lower costs, drive organic traffic, and execute proven technical strategies. Get started today!'; }
add_filter('pre_get_document_title', static function ($title) { return is_front_page() ? 'White Label SEO Services | SEO Outsourcing Philippines' : $title; });
add_filter('wpseo_title', static function ($title) { return is_front_page() ? 'White Label SEO Services | SEO Outsourcing Philippines' : $title; });
add_filter('wpseo_metadesc', static function ($description) { return is_front_page() ? sop_home_description() : $description; });
add_filter('wpseo_opengraph_image', static function ($url) { return is_front_page() ? get_template_directory_uri().'/assets/og-image.png' : $url; });
add_action('wp_head', static function () {
  if (!is_front_page() || defined('WPSEO_VERSION') || defined('RANK_MATH_VERSION')) return;
  echo '<meta name="description" content="'.esc_attr(sop_home_description()).'">';
  echo '<meta property="og:type" content="website"><meta property="og:title" content="White Label SEO Services | SEO Outsourcing Philippines"><meta property="og:description" content="'.esc_attr(sop_home_description()).'"><meta property="og:url" content="'.esc_url(home_url('/')).'"><meta property="og:image" content="'.esc_url(get_template_directory_uri().'/assets/og-image.png').'"><meta name="twitter:card" content="summary_large_image">';
  echo '<script type="application/ld+json">'.wp_json_encode(array('@context'=>'https://schema.org','@type'=>'Organization','name'=>'SEO Outsourcing Philippines','url'=>home_url('/'),'email'=>'info@seooutsourcingphilippines.com')).'</script>';
}, 6);

add_action('template_redirect', static function () {
  if (!is_page('contact')) return;
  if (!defined('DONOTCACHEPAGE')) define('DONOTCACHEPAGE', true);
  nocache_headers();
}, 1);
add_action('send_headers', static function () {
  $existing = implode("\n", headers_list());
  foreach (array('X-Content-Type-Options'=>'nosniff', 'Referrer-Policy'=>'strict-origin-when-cross-origin',
      'Permissions-Policy'=>'camera=(), microphone=(), geolocation=()') as $name=>$value) {
    if (stripos($existing,$name.':') === false) header($name.': '.$value);
  }
});
