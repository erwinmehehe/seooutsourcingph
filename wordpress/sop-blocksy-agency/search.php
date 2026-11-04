<?php if (!defined('ABSPATH')) exit; get_header(); ?>
<main id="main" class="sop-main"><?php sop_agency_heading('Search','Search results for “'.get_search_query().'”'); ?>
<section class="sop-section"><div class="sop-wrap sop-post-list"><?php if(have_posts()):while(have_posts()):the_post();?><article class="sop-post-row"><div></div><div><h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2><p><?php echo esc_html(wp_trim_words(get_the_excerpt(),26)); ?></p></div><a href="<?php the_permalink(); ?>" aria-label="Read result">↗</a></article><?php endwhile;the_posts_pagination();else:?><p>No results found. Try another search term.</p><?php endif;?></div></section></main>
<?php get_footer(); ?>
