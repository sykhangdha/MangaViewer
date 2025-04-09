<?php
/**
 * Plugin Name: Manga Viewer
 * Description: Displays manga chapters and images using shortcode [display_manga name="nameofmanga"].
 * Version: 1.5
 * Author: HaSky
 */

add_shortcode('display_manga', 'manga_viewer_shortcode');
add_action('wp_enqueue_scripts', 'manga_viewer_enqueue_scripts');

// Enqueue styles and scripts
function manga_viewer_enqueue_scripts() {
    // Get the last modified time of the JS file to use as a version
    $script_path = plugin_dir_path(__FILE__) . 'script.js';
    $script_version = file_exists($script_path) ? filemtime($script_path) : false;

    // Enqueue the style and script with versioning
    wp_enqueue_style('manga-viewer-style', plugin_dir_url(__FILE__) . 'style.css');
    wp_enqueue_script('manga-viewer-script', plugin_dir_url(__FILE__) . 'script.js', array('jquery'), $script_version, true);

    // Localize script for AJAX calls
    wp_localize_script('manga-viewer-script', 'mangaAjax', array(
        'ajaxurl' => admin_url('admin-ajax.php'),
    ));
}

// Shortcode to display manga
function manga_viewer_shortcode($atts) {
    // Extract the manga name from the shortcode attributes
    $atts = shortcode_atts(array('name' => ''), $atts);
    $manga_name = sanitize_text_field($atts['name']);

    if (empty($manga_name)) {
        return '<p>Please provide a manga name using [display_manga name="nameofmanga"].</p>';
    }

    // Start building the output HTML
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

    // Sort chapters by volume and chapter number using a custom function
    usort($dirs, function($a, $b) {
        $a_name = basename($a);
        $b_name = basename($b);

        // Match chapters with volume and chapter numbers (e.g., Vol. 1 Ch. 1.1)
        preg_match('/Vol\.\s*(\d+)\s*Ch\.\s*(\d+(\.\d+)?)/', $a_name, $a_match);
        preg_match('/Vol\.\s*(\d+)\s*Ch\.\s*(\d+(\.\d+)?)/', $b_name, $b_match);

        // If both are in "Vol. x Ch. x" format, compare by volume and chapter
        if ($a_match && $b_match) {
            $a_vol = (int) $a_match[1];
            $a_chapter = (float) $a_match[2];
            $b_vol = (int) $b_match[1];
            $b_chapter = (float) $b_match[2];

            if ($a_vol !== $b_vol) {
                return $b_vol - $a_vol;  // Sort volumes in descending order
            }

            return $b_chapter - $a_chapter;  // Sort chapters in descending order
        }

        // If one of the chapters doesn't match the "Vol. x Ch. x" format, treat it as a single chapter (Ch. 1, Ch. 2, etc.)
        if (!$a_match && !$b_match) {
            preg_match('/Ch\.\s*(\d+(\.\d+)?)/', $a_name, $a_match);
            preg_match('/Ch\.\s*(\d+(\.\d+)?)/', $b_name, $b_match);

            if ($a_match && $b_match) {
                $a_chapter = (float) $a_match[1];
                $b_chapter = (float) $b_match[1];
                return $b_chapter - $a_chapter;  // Sort chapters in descending order
            }
        }

        return 0; // Default comparison if formats don't match
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

    // Get all image files (jpg, jpeg, png) in the chapter folder
    $images = glob($path . '/*.{jpg,jpeg,png}', GLOB_BRACE);
    usort($images, function($a, $b) {
        return filemtime($a) - filemtime($b);
    });

    $image_urls = array_map(function($img) use ($url) {
        return $url . '/' . basename($img);
    }, $images);

    wp_send_json_success($image_urls);
}
