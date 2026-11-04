<?php
/** SEO Outsourcing Philippines — Blocksy child theme. */
if (!defined('ABSPATH')) exit;

require_once get_stylesheet_directory() . '/parts/content.php';
require_once get_stylesheet_directory() . '/parts/forms.php';

add_action('after_setup_theme', static function (): void {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('responsive-embeds');
    add_theme_support('html5', ['search-form','gallery','caption','style','script','comment-form']);
    register_nav_menus(['sop_main' => 'SEO Outsourcing — Main Navigation']);
});

add_action('wp_enqueue_scripts', static function (): void {
    $css = get_stylesheet_directory() . '/assets/agency.css';
    $js = get_stylesheet_directory() . '/assets/agency.js';
    wp_enqueue_style('sop-agency', get_stylesheet_directory_uri() . '/assets/agency.css', [], file_exists($css) ? (string) filemtime($css) : '1.0');
    wp_enqueue_script('sop-agency', get_stylesheet_directory_uri() . '/assets/agency.js', [], file_exists($js) ? (string) filemtime($js) : '1.0', true);
}, 90);

add_filter('body_class', static function (array $classes): array {
    $classes[] = 'sop-agency';
    return $classes;
});

// Explicit release gate for previews and this site's unapproved full-layout draft import.
add_filter('wp_robots', static function (array $robots): array {
    if (!defined('SOP_AGENCY_RELEASE_APPROVED') || SOP_AGENCY_RELEASE_APPROVED !== true) {
        $robots['noindex'] = true;
        $robots['nofollow'] = true;
    }
    if (is_singular() && get_post_meta(get_queried_object_id(), '_sop_full_layout', true) === '1'
        && get_post_meta(get_queried_object_id(), 'sop_release_status', true) !== 'APPROVED') {
        $robots['noindex'] = true;
        $robots['nofollow'] = true;
    }
    return $robots;
}, 30);

add_action('template_redirect', static function (): void {
    if (!is_singular()) return;
    $id = get_queried_object_id();
    if (get_post_meta($id, '_sop_full_layout', true) !== '1') return;
    if (get_post_meta($id, 'sop_release_status', true) === 'APPROVED') return;
    if (current_user_can('edit_post', $id)) return;
    status_header(404);
    nocache_headers();
    wp_die('This page is not available.', 'Page unavailable', ['response' => 404]);
});

add_filter('wp_sitemaps_posts_query_args', static function ($args, $post_type) {
    if (!in_array($post_type, ['page', 'post'], true)) return $args;
    $args['meta_query'] = [
        'relation' => 'OR',
        ['key' => '_sop_full_layout', 'compare' => 'NOT EXISTS'],
        ['relation' => 'AND',
            ['key' => '_sop_full_layout', 'value' => '1', 'compare' => '='],
            ['key' => 'sop_release_status', 'value' => 'APPROVED', 'compare' => '=']
        ]
    ];
    return $args;
}, 30, 2);

// Respects any installed SEO plugin's metadata, canonicals and schema. Add modest fallback metadata only.
add_action('wp_head', static function (): void {
    if (defined('WPSEO_VERSION') || defined('RANK_MATH_VERSION') || defined('AIOSEO_VERSION')) return;
    if (is_front_page()) {
        echo '<meta name="description" content="SEO outsourcing in the Philippines for agencies and businesses. Technical SEO, local SEO, on-page delivery, content briefs and white-label support with documented QA." />' . "\n";
        $org = ['@context'=>'https://schema.org','@type'=>'Organization','@id'=>home_url('/#organization'),
            'name'=>'SEO Outsourcing Philippines','url'=>home_url('/')];
        echo '<script type="application/ld+json">' . wp_json_encode($org, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE) . '</script>' . "\n";
    }
}, 2);

// Page templates resolve published WordPress content, never create pages on activation.
add_filter('template_include', static function (string $template): string {
    if (!is_page()) return $template;
    $slug = get_post_field('post_name', get_queried_object_id());
    $paths = [
        'services' => 'page-services.php',
        'pricing' => 'page-pricing.php',
        'about' => 'page-about.php',
        'contact' => 'page-contact.php',
        'book-discovery-call' => 'page-contact.php',
        'for-agencies' => 'page-agencies.php',
        'for-businesses' => 'page-businesses.php',
        'results' => 'page-results.php',
        'case-studies' => 'page-results.php',
        'samples' => 'page-samples.php',
        'how-it-works' => 'page-process.php',
        'talent' => 'page-talent.php',
        'careers' => 'page-talent.php',
        'join-our-team' => 'page-talent.php',
        'blog' => 'home.php'
    ];
    if (isset($paths[$slug])) {
        $found = locate_template($paths[$slug]);
        if ($found) return $found;
    }
    // Existing nested services keep exact URL slugs.
    $parent = (int) wp_get_post_parent_id(get_queried_object_id());
    if ($parent && get_post_field('post_name', $parent) === 'services') {
        $found = locate_template('page-service-detail.php');
        if ($found) return $found;
    }
    return $template;
}, 30);

// Simple admin warning prevents inadvertent release of a restricted preview.
add_action('admin_notices', static function (): void {
    if (!current_user_can('manage_options')) return;
    if (defined('SOP_AGENCY_RELEASE_APPROVED') && SOP_AGENCY_RELEASE_APPROVED === true) return;
    echo '<div class="notice notice-warning"><p><strong>SEO Outsourcing Philippines preview:</strong> This child theme intentionally remains noindex until evidence, legal, forms and launch are approved. Do not enable SOP_AGENCY_RELEASE_APPROVED before sign-off.</p></div>';
});

function sop_agency_link(string $path): string {
    return esc_url(home_url($path));
}
function sop_agency_cta(string $label = 'Request a proposal', string $path = '/contact/'): void {
    printf('<a class="sop-btn sop-btn--dark" href="%s">%s <span aria-hidden="true">↗</span></a>', sop_agency_link($path), esc_html($label));
}
function sop_agency_heading(string $eyebrow, string $heading, string $description = ''): void {
    echo '<section class="sop-subhero"><div class="sop-wrap"><p class="sop-eyebrow">'.esc_html($eyebrow).'</p><h1>'.esc_html($heading).'</h1>';
    if ($description) echo '<p class="sop-intro">'.esc_html($description).'</p>';
    echo '</div></section>';
}
function sop_agency_editable_content(): void {
    if (!have_posts()) return;
    while (have_posts()) {
        the_post();
        $raw = trim(get_post_field('post_content', get_the_ID()));
        if (!$raw) continue;
        // The old draft import includes a complete previous design. Only show the newly authored editor content.
        if (get_post_meta(get_the_ID(), '_sop_full_layout', true) === '1') continue;
        echo '<div class="sop-wrap sop-editor-content">';
        the_content();
        echo '</div>';
    }
}
