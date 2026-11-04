<?php if (!defined('ABSPATH')) exit; get_header(); ?>
<main id="main" class="sop-main"><?php while(have_posts()):the_post();
if(get_post_meta(get_the_ID(),'_sop_case_permission',true)!=='yes')continue;
$challenge=get_post_meta(get_the_ID(),'_sop_challenge',true);
$execution=get_post_meta(get_the_ID(),'_sop_execution',true);
$results=get_post_meta(get_the_ID(),'_sop_results',true);
$source=get_post_meta(get_the_ID(),'_sop_source',true);
$quote=get_post_meta(get_the_ID(),'_sop_quote_permission',true)==='yes'?get_post_meta(get_the_ID(),'_sop_quote',true):'';
?>
<section class="sop-subhero"><div class="sop-wrap"><nav class="sop-breadcrumb" aria-label="Breadcrumb"><a href="<?php echo sop_agency_link('/'); ?>">Home</a><span>/</span><a href="<?php echo sop_agency_link('/case-studies/'); ?>">Case studies</a></nav><p class="sop-eyebrow">Approved client project</p><h1><?php the_title(); ?></h1><p class="sop-intro"><?php echo esc_html(get_the_excerpt()); ?></p></div></section>
<div class="sop-wrap sop-case-detail sop-editor-content">
<?php if($challenge): ?><section><h2>Challenge</h2><p><?php echo nl2br(esc_html($challenge)); ?></p></section><?php endif; ?>
<?php if($execution): ?><section><h2>Strategy & technical execution</h2><p><?php echo nl2br(esc_html($execution)); ?></p></section><?php endif; ?>
<section><h2>Implementation notes</h2><?php the_content(); ?></section>
<?php if($results): ?><section><h2>Measured results</h2><p><?php echo nl2br(esc_html($results)); ?></p><p class="sop-caption">Results should specify the measured period, analytics filters, attribution limits and source.</p></section><?php endif; ?>
<?php if($source): ?><p><a rel="noopener noreferrer" target="_blank" href="<?php echo esc_url($source); ?>">Open approved source evidence ↗</a></p><?php endif; ?>
<?php if($quote): ?><blockquote><?php echo esc_html($quote); ?></blockquote><?php endif; ?>
</div><?php endwhile; ?>
<?php sop_agency_section_cta('Request a similar scope for your website.'); ?></main><?php get_footer(); ?>
