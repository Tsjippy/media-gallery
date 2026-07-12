<?php

namespace TSJIPPY\MEDIAGALLERY;

/**
 * Plugin Name:          Tsjippy Media Gallery
 * Description:          This plugin adds a media gallery of downloadable pictures, video's and audio files.
 * Version:              10.4.2
 * Author:               Ewald Harmsen
 * AuthorURI:            harmseninnigeria.nl
 * Requires at least:    6.3
 * Requires PHP:         8.3
 * Tested up to:         7.0
 * Plugin URI:            https://github.com/Tsjippy/mediagallery
 * Tested:               7.0
 * TextDomain:            tsjippy
 * Requires Plugins:    
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 *
 * @author Ewald Harmsen
 */
if (! defined('ABSPATH')) {
    exit;
}

// Load shared code
if(file_exists(__DIR__  . '/shared-functionality/loader.php')){
    require_once(__DIR__  . '/shared-functionality/loader.php');
}

// Define constants
define(__NAMESPACE__ . '\PLUGIN', plugin_basename(__FILE__));
define(__NAMESPACE__ . '\PLUGINPATH', __DIR__ . '/');
define(__NAMESPACE__ . '\PLUGINVERSION', get_plugin_data(__FILE__, false, false)['Version']);
define(__NAMESPACE__ . '\PLUGINSLUG', str_replace('tsjippy-', '', basename(__FILE__, '.php')));
define(__NAMESPACE__ . '\SETTINGS', get_option('tsjippy_media-gallery_settings', []));

// run right before activation
register_activation_hook(__FILE__, function () {

    // Load shared code
    if(file_exists(__DIR__  . '/shared-functionality/loader.php')){
        require_once(__DIR__  . '/shared-functionality/loader.php');
    }

    $postId     = \TSJIPPY\ADMIN\createDefaultPage('Media Gallery', '[tsjippy_mediagallery]');

    $pages      = SETTINGS['pages'] ?? [];

    $pages[$postId]    = $postId;

    $settings   = SETTINGS;
    $settings['pages'] = $pages;

    update_option('tsjippy_media-gallery_settings', $settings);

    if(function_exists('TSJIPPY\activate')){
        \TSJIPPY\activate();
    }
});

// run on deactivation
register_deactivation_hook(__FILE__, function () {
    foreach (SETTINGS['pages'] ?? [] as $page) {
        // Remove the auto created page
        wp_delete_post($page, true);
    }
});
