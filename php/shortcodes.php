<?php

namespace TSJIPPY\MEDIAGALLERY;

use TSJIPPY;

add_shortcode('mediagallery', __NAMESPACE__ . '\mediaGallery');
function mediaGallery($atts)
{
    $a = shortcode_atts(array(
        'categories'     => [],
        'types'         => ['image', 'audio', 'video'],
        'amount'        => 20,
        'color'         => '#FFFFFF'
    ), $atts);

    if (!is_array($a['categories'])) {
        $a['categories']    = explode(',', $a['categories']);
    }

    $mediaGallery   = new MediaGallery($a['types'], $a['amount'], $a['categories'], false, 1, '', $a['color']);

    return $mediaGallery->filterableMediaGallery();
}
