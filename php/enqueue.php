<?php

namespace TSJIPPY\MEDIAGALLERY;

use TSJIPPY;

add_action('wp_after_insert_post', __NAMESPACE__ . '\afterInsertPost', 10, 2);
/**
 * Set the default picture of a post after it is inserted
 *
 * @param    int        $postId        The WP_Post id
 * @param    \WP_Post    $post        The WP_Post object
 */
function afterInsertPost($postId, $post)
{
    if (has_shortcode($post->post_content, 'mediagallery')) {

        $pages           = SETTINGS['pages'] ?? false;

        $pages[$postId]  = $postId;

        $settings        = SETTINGS;
        $settings['pages'] = $pages;

        update_option('tsjippy_media-gallery_settings', $settings);
    }
}

add_action('wp_trash_post', __NAMESPACE__ . '\trashPost');
/**
 * Runs when a post is trashed
 * 
 * @param   int $postId
 */
function trashPost($postId)
{
    $pages  = SETTINGS['pages'] ?? false;
    if (isset($pages[$postId])) {
        unset($pages[$postId]);

        $settings   = SETTINGS;
        $settings['pages'] = $pages;

        update_option('tsjippy_media-gallery_settings', $settings);
    }
}

add_action('wp_enqueue_scripts', __NAMESPACE__ . '\enqueueMediaGalleryScripts');
/**
 * Registeres the CSS and JS
 */
function enqueueMediaGalleryScripts()
{
    /**
     * CSS
     */
    wp_register_style('tsjippy_gallery_style', TSJIPPY\pathToUrl(PLUGINPATH . 'css/media_gallery.min.css'), array(), PLUGINVERSION);

    /**
     * Scripts
     */
    // Auto Refresh
    $deps   = SCRIPT_DEBUG ? [  
        '@tsjippy/form_submit_functions'
    ] :
    [];

    $deps[] = "@tsjippy/nonce_script";
    wp_register_script_module('@tsjippy/refresh_gallery_script', TSJIPPY\pathToUrl(PLUGINPATH . 'js/auto_refresh' . TSJIPPY\JSEXTENSION), $deps, PLUGINVERSION);

    // Media Gallery
    $deps   = SCRIPT_DEBUG ? [  
        '@tsjippy/form_submit_functions',
        "@tsjippy/show_loader", 
        "@tsjippy/display_message", 
        "@tsjippy/alert"
    ] :
    [];

    $deps[] = "@tsjippy/nonce_script";
    wp_register_script_module('@tsjippy/gallery_script', TSJIPPY\pathToUrl(PLUGINPATH . 'js/media_gallery' . TSJIPPY\JSEXTENSION), $deps, PLUGINVERSION);

}
