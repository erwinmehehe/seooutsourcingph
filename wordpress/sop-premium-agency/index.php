<?php if (!defined('ABSPATH')) exit; get_header(); ?>
<main id="main"><?php if (have_posts()) : while (have_posts()) : the_post(); the_content(); endwhile; else : ?><section class="section"><div class="container"><h1>Content unavailable</h1></div></section><?php endif; ?></main>
<?php get_footer(); ?>
