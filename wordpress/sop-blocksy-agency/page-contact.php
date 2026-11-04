<?php if (!defined('ABSPATH')) exit; get_header(); ?>
<main class="sop-main" id="main"><?php sop_agency_heading('Contact & consultation','Let’s talk about the work you need done.','Share the website, the workstream, and who will review the result. We will respond with a suitable next step.'); ?>
<section class="sop-section"><div class="sop-wrap sop-contact-columns"><div class="sop-contact-aside"><p class="sop-eyebrow">Start here</p><h2>What helps us quote accurately?</h2><ul class="sop-check-list"><li>The website and target search market.</li><li>The backlog or issue you want to solve.</li><li>Whether this is agency white-label work.</li><li>CMS / analytics access and review responsibilities.</li><li>Your preferred deadline and output format.</li></ul><div class="sop-contact-direct"><p>Email us directly</p><a href="mailto:info@seooutsourcingphilippines.com">info@seooutsourcingphilippines.com</a></div><div class="sop-calendar"><h3>Consultation booking</h3><p>A live calendar appears here once a verified scheduling URL is configured. Until then, the enquiry form does not claim to reserve an appointment.</p><?php
$booking = defined('SOP_BOOKING_URL') ? SOP_BOOKING_URL : '';
$embed = defined('SOP_BOOKING_EMBED_URL') ? SOP_BOOKING_EMBED_URL : '';
$host = $embed ? strtolower((string) wp_parse_url($embed, PHP_URL_HOST)) : '';
$allowed = ['calendly.com','cal.com','app.cal.com'];
if ($embed && wp_http_validate_url($embed) && str_starts_with($embed,'https://') && in_array($host,$allowed,true)) {
  echo '<iframe class="sop-booking-embed" src="'.esc_url($embed).'" title="Book an SEO consultation" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>';
} elseif ($booking && wp_http_validate_url($booking) && str_starts_with($booking, 'https://')) {
  echo '<a class="sop-text-cta" target="_blank" rel="noopener noreferrer" href="'.esc_url($booking).'">Open verified booking calendar ↗</a>';
}
?></div></div><div><?php sop_agency_form('full'); ?></div></div></section>
</main><?php get_footer(); ?>
