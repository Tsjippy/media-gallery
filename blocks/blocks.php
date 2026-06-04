<?php
namespace TSJIPPY\MEDIAGALLERY;
use TSJIPPY;

add_action('init', __NAMESPACE__ . '\initBlocks');
function initBlocks() {
    register_block_type(
        __DIR__ . '/media-gallery/build',
        array(
            'render_callback' => function ($args) {
                $mediaGallery   = new MediaGallery([], 20, $args['categories'], false, 1, '', $args['color']);

                return $mediaGallery->filterableMediaGallery();
            },
            'attributes'      => [
                'color' => [
                    'type'         => 'string',
                    'default'    => '#FFFFFF'
                ],
                'categories' => [
                    'type'         => 'array',
                    'default'    => []
                ],
            ]
       )
   );
}

add_action('enqueue_block_assets', __NAMESPACE__ . '\loadBlockAssets');
function loadBlockAssets() {
    if (is_admin()) {
        TSJIPPY\enqueueScripts();

        enqueueMediaGalleryScripts();

        if (function_exists('TSJIPPY\VIMEO\enqueueVimeoScripts')) {
            TSJIPPY\VIMEO\enqueueVimeoScripts();
        }

        wp_enqueue_script('tsjippy_vimeo_shortcode_script');
    }
}
