<?php if (!defined('ABSPATH')) exit; ?><!doctype html>
<html <?php language_attributes(); ?>><head><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="google-site-verification" content="zjY_Lrg-eC1N8fPXARPBeYg2otuitmqG4l2jyAntTTo" />
<link rel="icon" type="image/svg+xml" href="<?php echo esc_url(get_template_directory_uri().'/assets/favicon.svg'); ?>">
<?php wp_head(); ?>
<script data-sop-ga4>
(function () {
  // Track only the canonical website, never GitHub Pages or local previews.
  if (!/^(?:www\.)?seooutsourcingphilippines\.com$/i.test(location.hostname)) return;
  var id = 'G-Y6B0JEJRZ4';
  // Avoid a duplicate page_view if this property is already installed.
  if (window.__sopGa4Initialized ||
      document.querySelector('script[src*="googletagmanager.com/gtag/js?id=' + id + '"]')) return;
  window.__sopGa4Initialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', id);
  var loader = document.createElement('script');
  loader.async = true;
  loader.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  document.head.appendChild(loader);

  // Only send the two established conversion-event names, never form content.
  var quoteRecorded = false;
  function record(name) {
    if (name !== 'quote_request_success' && name !== 'discovery_call_click') return;
    if (name === 'quote_request_success') {
      if (quoteRecorded) return;
      quoteRecorded = true;
    }
    window.gtag('event', name);
  }
  window.addEventListener('sop:conversion', function (event) {
    record(event.detail && event.detail.event);
  });
  document.addEventListener('click', function (event) {
    var link = event.target && event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    try {
      if (new URL(link.href, location.href).hostname === 'calendly.com') record('discovery_call_click');
    } catch (_error) {}
  });
  function checkQuoteSuccess() {
    if (document.querySelector('[data-sop-quote-received]')) record('quote_request_success');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkQuoteSuccess, { once: true });
  } else {
    checkQuoteSuccess();
  }
})();
</script>
</head><body <?php body_class(); ?>><?php wp_body_open(); ?><a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="container header-inner"><a class="brand" aria-label="SEO Outsourcing Philippines home" href="<?php echo esc_url(home_url('/')); ?>"><img class="brand-symbol" src="<?php echo esc_url(get_template_directory_uri().'/assets/favicon.svg'); ?>" alt="" width="42" height="42"/><span><span class="brand-name">SEO Outsourcing</span><span class="brand-sub">Philippines</span></span></a><nav aria-label="Main navigation" class="main-nav"><a href="<?php echo esc_url(home_url('/services/')); ?>">Services</a><a href="<?php echo esc_url(home_url('/results/')); ?>">Our work</a><a href="<?php echo esc_url(home_url('/pricing/')); ?>">Pricing</a><a href="<?php echo esc_url(home_url('/about/')); ?>">About</a></nav><div class="shell-actions"><a class="btn" href="<?php echo esc_url(home_url('/contact/')); ?>">Get a Quote →</a><a class="btn outline" href="https://calendly.com/discovery-call-with-erwin" target="_blank" rel="noopener noreferrer">Book a call ↗</a></div><button type="button" aria-controls="mobile-navigation" aria-expanded="false" aria-label="Toggle navigation" class="menu-toggle" data-menu-button>Menu</button></div><nav aria-label="Mobile navigation" class="mobile-nav" data-mobile-nav id="mobile-navigation" hidden><a href="<?php echo esc_url(home_url('/services/')); ?>">Services</a><a href="<?php echo esc_url(home_url('/results/')); ?>">Our work</a><a href="<?php echo esc_url(home_url('/pricing/')); ?>">Pricing</a><a href="<?php echo esc_url(home_url('/about/')); ?>">About</a><a class="btn" href="<?php echo esc_url(home_url('/contact/')); ?>">Get a Quote →</a><a href="https://calendly.com/discovery-call-with-erwin" target="_blank" rel="noopener noreferrer">Book a discovery call ↗</a></nav></header>