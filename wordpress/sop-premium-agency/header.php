<?php if (!defined('ABSPATH')) exit; ?><!doctype html>
<html <?php language_attributes(); ?>><head><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="icon" type="image/svg+xml" href="<?php echo esc_url(get_template_directory_uri().'/assets/favicon.svg'); ?>">
<?php wp_head(); ?></head>
<body <?php body_class(); ?>><?php wp_body_open(); ?>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="container header-inner">
<a class="brand" aria-label="SEO Outsourcing Philippines home" href="<?php echo esc_url(home_url('/')); ?>"><span aria-hidden="true" class="brand-mark">»</span><span><span class="brand-name">SEO Outsourcing</span><span class="brand-sub">Philippines</span></span></a>
<nav class="main-nav" aria-label="Main navigation">
<a href="<?php echo esc_url(home_url('/services/')); ?>">Services</a><a href="<?php echo esc_url(home_url('/industries/')); ?>">Industries</a><a href="<?php echo esc_url(home_url('/results/')); ?>">Results</a><a href="<?php echo esc_url(home_url('/how-it-works/')); ?>">How it works</a><a href="<?php echo esc_url(home_url('/blog/')); ?>">Insights</a><a href="<?php echo esc_url(home_url('/about/')); ?>">About</a></nav>
<a class="btn header-cta" href="<?php echo esc_url(home_url('/contact/')); ?>">Get a tailored proposal →</a>
<button type="button" class="menu-toggle" data-menu-button aria-controls="mobile-navigation" aria-expanded="false" aria-label="Toggle navigation">Menu</button>
</div><nav class="mobile-nav" data-mobile-nav id="mobile-navigation" aria-label="Mobile navigation">
<a href="<?php echo esc_url(home_url('/services/')); ?>">Services</a><a href="<?php echo esc_url(home_url('/industries/')); ?>">Industries</a><a href="<?php echo esc_url(home_url('/results/')); ?>">Results</a><a href="<?php echo esc_url(home_url('/how-it-works/')); ?>">How it works</a><a href="<?php echo esc_url(home_url('/blog/')); ?>">Insights</a><a href="<?php echo esc_url(home_url('/about/')); ?>">About</a>
<a class="btn" href="<?php echo esc_url(home_url('/contact/')); ?>">Get a tailored proposal →</a></nav></header>
