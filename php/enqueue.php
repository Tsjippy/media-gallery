<?php

namespace TSJIPPY\MEDIAGALLERY;

use TSJIPPY;

add_action('wp_after_insert_post', __NAMESPACE__ . '\afterInsertPost', 10, 2);
function afterInsertPost($postId, $post)
{
    if (has_shortcode($post->post_content, 'mediagallery')) {

        $pages           = SETTINGS['mediagallery-pages'] ?? false;

        $pages[$postId]  = $postId;

        $settings        = SETTINGS;
        $settings['mediagallery-pages'] = $pages;

        update_option('tsjippy_mediagallery_settings', $settings);
    }
}

add_action('wp_trash_post', __NAMESPACE__ . '\trashPost');
function trashPost($postId)
{
    $pages  = SETTINGS['mediagallery-pages'] ?? false;
    if (isset($pages[$postId])) {
        unset($pages[$postId]);

        $settings   = SETTINGS;
        $settings['mediagallery-pages'] = $pages;

        update_option('tsjippy_mediagallery_settings', $settings);
    }
}

add_action('wp_enqueue_scripts', __NAMESPACE__ . '\enqueueMediaGalleryScripts');
function enqueueMediaGalleryScripts()
{
    wp_register_style('tsjippy_gallery_style', TSJIPPY\pathToUrl(PLUGINPATH . 'css/media_gallery.min.css'), array(), PLUGINVERSION);

    wp_register_script('tsjippy_gallery_script', TSJIPPY\pathToUrl(PLUGINPATH . 'js/media_gallery.min.js'), array('tsjippy_formsubmit_script'), PLUGINVERSION, true);
    wp_register_script('tsjippy_refresh_gallery_script', TSJIPPY\pathToUrl(PLUGINPATH . 'js/auto_refresh.min.js'), array('tsjippy_formsubmit_script'), PLUGINVERSION, true);

    $pages   = SETTINGS['mediagallery-pages'] ?? [];
    if (is_numeric(get_the_ID()) && in_array(get_the_ID(), $pages)) {
        wp_enqueue_style('tsjippy_gallery_style');
        wp_enqueue_script('tsjippy_gallery_script');
    }
}
