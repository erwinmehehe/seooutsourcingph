<?php if (!defined('ABSPATH')) exit; get_header(); ?>
<main id="main" class="sop-main"><?php sop_agency_heading('Articles', get_the_archive_title(), get_the_archive_description()); ?>
<section class="sop-section"><div class="sop-wrap sop-post-list"><?php if(have_posts()):while(have_posts()):the_post();?><article class="sop-post-row"><div class="sop-post-meta"><?php echo esc_html(get_the_date()); ?></div><div><h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2><p><?php echo esc_html(wp_trim_words(get_the_excerpt(),26)); ?></p></div><a href="<?php the_permalink(); ?>" aria-label="Read article">↗</a></article><?php endwhile;the_posts_pagination();endif;?></div></section></main>
<?php get_footer(); ?>
