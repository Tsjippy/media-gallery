<?php

namespace TSJIPPY\MEDIAGALLERY;

use TSJIPPY;

add_action('rest_api_init', __NAMESPACE__ . '\blockRestApiInit');
function blockRestApiInit()
{
    // show schedules
    register_rest_route(
        RESTAPIPREFIX . '/mediagallery',
        '/show',
        array(
            'methods'                 => 'POST',
            'callback'                 => __NAMESPACE__ . '\displayMediaGallery',
            'permission_callback'     => '__return_true',    // Allow non-logged in users to access this endpoint
        )
    );
}

/**
 * Displays the media gallery based on the provided request parameters.
 *
 * @param \WP_REST_Request $wpRestRequest The REST request object.
 * @return array The media gallery data.
 */
function displayMediaGallery($wpRestRequest)
{

    $args = wp_parse_args($wpRestRequest->get_params(), array(
        'categories'    => []
    ));

    $mediaGallery   = new MediaGallery(['image'], 20, $args['categories'], false, 1, '', $args['color']);

    return $mediaGallery->filterableMediaGallery();
}
