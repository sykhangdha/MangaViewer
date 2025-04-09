<?php
/**
 * Plugin Name: Manga Viewer
 * Description: Displays manga chapters and images using shortcode [display_manga name="nameofmanga"].
 * Version: 1.4
 * Author: HaSky
 */

add_shortcode('display_manga', 'manga_viewer_shortcode');
add_action('wp_enqueue_scripts', 'manga_viewer_enqueue_scripts');

function manga_viewer_enqueue_scripts() {
    // Get the last modified time of the JS file to use as a version
    $script_path = plugin_dir_path(__FILE__) . 'script.js';
    $script_version = file_exists($script_path) ? filemtime($script_path) : false;

    // Enqueue the style and script with versioning
    wp_enqueue_style('manga-viewer-style', plugin_dir_url(__FILE__) . 'style.css');
    wp_enqueue_script('manga-viewer-script', plugin_dir_url(__FILE__) . 'script.js', array('jquery'), $script_version, true);
    
    wp_localize_script('manga-viewer-script', 'mangaAjax', array(
        'ajaxurl' => admin_url('admin-ajax.php'),
    ));
}

function manga_viewer_shortcode($atts) {
    $atts = shortcode_atts(array('name' => ''), $atts);
    $manga_name = sanitize_text_field($atts['name']);

    if (empty($manga_name)) {
        return '<p>Please provide a manga name using [display_manga name="nameofmanga"].</p>';
    }

    $output = '<div class="manga-viewer" data-manga-name="' . esc_attr($manga_name) . '">';
    $output .= '<h2 id="manga-heading">' . esc_html($manga_name) . '</h2>';
    $output .= '<ul class="chapter-list"></ul>';
    $output .= '<div class="view-toggle">
                    <button data-view="list">List View</button> 
                    <button data-view="paged">Paged View</button>
                 </div>';
    $output .= '<div id="manga-images" class="manga-images"></div>';
    $output .= '<button id="back-to-chapters" style="display:none;">Back to Chapter List</button>';
    $output .= '</div>';
    return $output;
}

// AJAX endpoint: fetch chapters
add_action('wp_ajax_get_chapters', 'manga_viewer_get_chapters');
add_action('wp_ajax_nopriv_get_chapters', 'manga_viewer_get_chapters');

function manga_viewer_get_chapters() {
    $manga = sanitize_text_field($_POST['manga']);
    $path = ABSPATH . 'manga/' . $manga;

    if (!is_dir($path)) {
        wp_send_json_error("Manga not found.");
    }

    // Get all subdirectories in the manga folder
    $dirs = array_filter(glob($path . '/*'), 'is_dir');
    usort($dirs, function($a, $b) {
        return version_compare(basename($b), basename($a)); // Reverse order: Ch. 3, Ch. 2, Ch. 1
    });

    $chapters = array_map(function($dir) {
        $chapter_name = basename($dir);
        $upload_time = filemtime($dir);
        $upload_date = date("Y-m-d", $upload_time);
        return array('name' => $chapter_name, 'date' => $upload_date);
    }, $dirs);

    wp_send_json_success(array(
        'chapters' => $chapters
    ));
}

// AJAX endpoint: fetch images
add_action('wp_ajax_get_images', 'manga_viewer_get_images');
add_action('wp_ajax_nopriv_get_images', 'manga_viewer_get_images');

function manga_viewer_get_images() {
    $manga = sanitize_text_field($_POST['manga']);
    $chapter = sanitize_text_field($_POST['chapter']);
    $path = ABSPATH . 'manga/' . $manga . '/' . $chapter;
    $url = site_url('/manga/' . $manga . '/' . $chapter);

    if (!is_dir($path)) {
        wp_send_json_error("Chapter not found.");
    }

    $images = glob($path . '/*.{jpg,jpeg,png}', GLOB_BRACE);
    usort($images, function($a, $b) {
        return filemtime($a) - filemtime($b);
    });

    $image_urls = array_map(function($img) use ($url) {
        return $url . '/' . basename($img);
    }, $images);

    wp_send_json_success($image_urls);
}
?>
