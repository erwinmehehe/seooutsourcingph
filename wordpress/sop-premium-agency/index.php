<?php if (!defined('ABSPATH')) exit; get_header(); ?>
<main id="main"><section class="page-hero"><div class="container"><h1><?php
if (is_search()) echo 'Search results for '.esc_html(get_search_query());
elseif (is_archive()) echo esc_html(wp_strip_all_tags(get_the_archive_title()));
else echo 'SEO guides';
?></h1></div></section><section class="section"><div class="container">
<?php if (have_posts()) : ?><div class="grid three"><?php while (have_posts()) : the_post(); ?>
<article class="card feature-card"><h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2><p><?php echo esc_html(wp_trim_words(wp_strip_all_tags(strip_shortcodes(get_the_excerpt())), 35)); ?></p><a class="more" href="<?php the_permalink(); ?>">Read article →</a></article>
<?php endwhile; ?></div><?php the_posts_pagination(); else : ?><p>No articles found. <a href="<?php echo esc_url(home_url('/blog/')); ?>">Browse SEO guides</a>.</p><?php endif; ?>
</div></section></main><?php get_footer(); ?>
