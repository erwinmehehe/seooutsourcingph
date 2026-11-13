<?php
if (!defined('ABSPATH')) exit;
$content = apply_filters('the_content', get_the_content());
$full_layout = get_post_meta(get_the_ID(), '_sop_full_layout', true) === '1';
if ($full_layout) {
    echo $content;
} else {
    echo '<section class="section"><article class="container policy-copy">';
    if (stripos($content, '<h1') === false) echo '<h1>'.esc_html(get_the_title()).'</h1>';
    echo $content;
    echo '</article></section>';
}
