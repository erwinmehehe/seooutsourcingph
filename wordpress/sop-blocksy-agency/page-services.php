<?php if (!defined('ABSPATH')) exit; get_header();
$service_groups = [
    ['Technical & architecture',['technical-seo','seo-audits','on-page-seo','schema-entity-seo']],
    ['Content & search intent',['seo-content','seo-strategy','semantic-keyword-mapping','answer-engine-optimization']],
    ['Agency delivery & visibility',['white-label-seo','local-seo','multi-location-seo','seo-reporting','link-building']]
]; ?>
<main class="sop-main" id="main"><?php sop_agency_heading('Our services', 'SEO services built around real deliverables.', 'Choose an SEO workstream, review what is included, and request a defined proposal. Our work can support your own business or sit behind your agency’s client experience.'); ?>
<section class="sop-section"><div class="sop-wrap sop-section-columns"><div class="sop-section-rail"><p class="sop-eyebrow">Start with the work</p><h2>One specialist task. Or an ongoing delivery lane.</h2><p>We define the access, owner, review process, and what counts as complete before taking a task into production.</p></div><div>
<?php foreach($service_groups as $group): ?><div class="sop-service-group"><h3><?php echo esc_html($group[0]); ?></h3><?php sop_agency_service_rows($group[1]); ?></div><?php endforeach; ?>
</div></div></section>
<section class="sop-section sop-section--paper"><div class="sop-wrap sop-section-columns"><div class="sop-section-rail"><p class="sop-eyebrow">Work sample</p><h2>What a useful SEO handoff looks like.</h2><p>Review our example ticket structure before buying an audit or assigning your next SEO sprint.</p></div><div><?php sop_agency_work_sample(); ?></div></div></section>
<?php sop_agency_editable_content(); sop_agency_section_cta('Need help choosing a workstream?', 'Send us the website, target market and current bottleneck.'); ?></main>
<?php get_footer(); ?>
