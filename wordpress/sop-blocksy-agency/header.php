<?php if (!defined('ABSPATH')) exit; ?><!doctype html>
<html <?php language_attributes(); ?>><head>
<meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?></head>
<body <?php body_class(); ?>><?php wp_body_open(); ?>
<a href="#main" class="sop-skip">Skip to content</a>
<div class="sop-utility"><div class="sop-wrap"><span>Philippines-based SEO production partner</span><a href="mailto:info@seooutsourcingphilippines.com">info@seooutsourcingphilippines.com</a></div></div>
<header class="sop-header" id="site-header">
 <div class="sop-wrap sop-header-inner">
  <a class="sop-brand" href="<?php echo sop_agency_link('/'); ?>" aria-label="SEO Outsourcing Philippines home">
    <span class="sop-brand-main">SEO <b>Outsourcing</b></span><span class="sop-brand-lower">PHILIPPINES <span class="sop-brand-rule" aria-hidden="true"></span></span>
  </a>
  <nav class="sop-nav" id="sop-main-nav" aria-label="Main menu">
   <?php if (has_nav_menu('sop_main')) :
      wp_nav_menu(['theme_location'=>'sop_main', 'container'=>false, 'menu_class'=>'sop-nav-list', 'depth'=>1, 'fallback_cb'=>false]);
   else : ?>
   <ul class="sop-nav-list"><li><a href="<?php echo sop_agency_link('/services/'); ?>">Services</a></li><li><a href="<?php echo sop_agency_link('/for-agencies/'); ?>">For agencies</a></li><li><a href="<?php echo sop_agency_link('/results/'); ?>">Our work</a></li><li><a href="<?php echo sop_agency_link('/about/'); ?>">About</a></li><li><a href="<?php echo sop_agency_link('/blog/'); ?>">Insights</a></li></ul>
   <?php endif; ?>
  </nav>
  <div class="sop-header-actions"><a class="sop-header-cta" href="<?php echo sop_agency_link('/contact/'); ?>">Request a proposal <span aria-hidden="true">↗</span></a>
  <button class="sop-menu-button" type="button" aria-expanded="false" aria-controls="sop-main-nav" aria-label="Open navigation"><span></span><span></span></button></div>
 </div>
</header>
