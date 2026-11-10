<?php
if (!defined('ABSPATH')) exit;
?><!doctype html>
<html <?php language_attributes(); ?>><head><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="sop-quote-url" content="<?php echo esc_url(home_url('/contact/')); ?>">
<link rel="icon" type="image/svg+xml" href="<?php echo esc_url(get_template_directory_uri().'/assets/favicon.svg'); ?>">
<?php wp_head(); ?></head><body <?php body_class(); ?>><?php wp_body_open(); ?>
<?php
// Generated from the same React source as the standalone homepage.
$homepage = get_template_directory().'/templates/homepage.html';
if (is_readable($homepage)) echo file_get_contents($homepage); // Trusted theme build output.
?>
<?php wp_footer(); ?></body></html>
