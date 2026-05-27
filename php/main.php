<?php
namespace TSJIPPY\MEDIAGALLERY;
use TSJIPPY;

//change visibility of an attachment when uploaded via frontend even if it is a picture
add_action('tsjippy_after_post_save', __NAMESPACE__.'\afterPostSave');
function afterPostSave($post){
    // Add to media gallery if post type is attachment
    if($post->post_type == 'attachment'){
        update_metadata( 'post',  $post->ID, 'gallery_visibility', 'show' );
    }
}

// change visibility of an attachment when it is a video or audio
add_action( 'add_attachment',__NAMESPACE__.'\addAttachment' );
function addAttachment( $postId) {
    $post   = get_post($postId);
    $type   = explode('/', $post->post_mime_type)[0];
    
    if(in_array($type, ['audio', 'video'])){
        update_metadata( 'post',  $post->ID, 'gallery_visibility', 'show' );
    }
}

add_filter('display_post_states', __NAMESPACE__.'\postStates', 10, 2);
function postStates( $states, $post ) {

	if ( $post->ID == (SETTINGS['mediagallery-pages'] ?? '')) {
		$states[] = __('Media gallery page');
	}

	return $states;
}