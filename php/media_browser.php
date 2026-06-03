<?php
namespace TSJIPPY\MEDIAGALLERY;
use TSJIPPY;

//add public/private radio buttons to attachment page
add_filter( 'attachment_fields_to_edit', __NAMESPACE__.'\mediaFieldsToEdit', 10, 2);
function mediaFieldsToEdit($formFields, $post ){
    $fieldValue = get_post_meta( $post->ID, 'gallery_visibility', true );

    ob_start();
    ?>
    <input type='radio' name='attachments[<?php echo esc_attr($post->ID);?>][gallery_visibility]' value='show' <?php if($fieldValue == 'show') echo 'checked';?>> Show
    <input type='radio' name='attachments[<?php echo esc_attr($post->ID);?>][gallery_visibility]' value='hide' <?php if($fieldValue != 'show') echo 'checked';?>> Hide
    <?php

    $formFields['gallery_visibility'] = array(
        'value' => $fieldValue,
        'label' => __( 'Gallery visibility' , 'tsjippy'),
        'input' => 'html',
        'html'  =>  ob_get_clean()
      );
    return $formFields;
}

add_action( 'edit_attachment', __NAMESPACE__.'\editAttachment' );
function editAttachment($attachmentId){
    if ( isset( $_REQUEST['attachments'][$attachmentId]['gallery_visibility'] ) ) {
        $visibility = $_REQUEST['attachments'][$attachmentId]['gallery_visibility'];

        //check if changed
        $prevVis   = get_post_meta( $attachmentId, 'gallery_visibility',true);

        if($prevVis != $visibility){
            //update post meta
            update_post_meta( $attachmentId, 'gallery_visibility', $visibility );
        }
    }
}