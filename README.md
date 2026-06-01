This module adds a media gallery of downloadable pictures, video's and audio files.

== Hooks ==
# FILTERS
- apply_filters('sim-media-gallery-categories', $categories);
- apply_filters( 'wp_mime_type_icon', SITEURL."/wp-includes/images/media/video.png", get_post_mime_type(), $id);
- apply_filters('sim_media_gallery_item_html', $mediaHtml, $type, $id);
- apply_filters('sim-media-edit-link', "<a href='".SITEURL."/wp-admin/upload.php?item=$id' class='button editmedia'>Edit</a>", $id);
- apply_filters('sim_media_gallery_download_url', $url, $id);
- apply_filters('sim_media_gallery_download_filename', '', $type, $id);