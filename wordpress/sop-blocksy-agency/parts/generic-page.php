<?php if (!defined('ABSPATH')) exit; ?>
<main id="main" class="sop-main sop-page-generic">
<?php while(have_posts()):the_post(); ?>
<section class="sop-subhero"><div class="sop-wrap"><p class="sop-eyebrow"><?php echo esc_html(get_post_type() === 'post' ? 'Article' : 'Information'); ?></p><h1><?php the_title(); ?></h1></div></section>
<div class="sop-wrap sop-post-body sop-editor-content"><?php the_content(); ?></div>
<?php endwhile; ?></main>
