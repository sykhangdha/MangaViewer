# Manga Viewer WordPress Plugin

**Manga Viewer** is a WordPress plugin that allows you to display manga chapters and images on your website. It works by grabbing chapters from /manga/(manganame) folder and displays the chapter list and loads the chapter when selected. It supports two viewing modes—List View and Paged View—along with chapter navigation and image loading via AJAX for a smoother reading experience. You can easily add the manga viewer to any page or post using a simple shortcode.

This plugin is based on the original **O.M.V (Open Manga Viewer)** plugin and extends its functionality for improved navigation and viewing.

## Features

- Display manga chapters and images with a responsive and user-friendly interface.
- Grabs mangas from this path: /manga/
- Toggle between **List View** and **Paged View** to view images.
- Navigation between manga chapters with **Previous** and **Next Chapter** buttons.
- **Back to Chapter List** button to return to the list of chapters.
- Supports folder-based manga organization on your server.
- Dynamic loading of chapters and images using AJAX, reducing page load time.

## To be Added

- ~Show dates for when chapters have been added~ *Added but not yet available in the release until other features are ready
- Notification system for when new chapters are released 
- Add way to detect alternative naming methods for chapters(currently folder names for chapters must be Ch. 1 for example)
- Create starter theme that can be easily modified to work with the viewer

## Installation

1. **Download the Plugin**  
   Download the latest version of the **Manga Viewer** plugin by [clicking here](https://github.com/sykhangdha/MangaViewer/releases/download/1/OMVReloaded.zip)  
   Alternatively, you can clone or download the source code from this repository.

2. **Install the Plugin**  
   - Upload plugin to wordpress

3. **Activate the Plugin**  
   Go to your WordPress admin panel (`wp-admin`), then navigate to **Plugins > Installed Plugins**. Find **Manga Viewer** in the list and click **Activate**.

4. **Add Manga Folders**  
   Place your manga folders in the `manga/` directory in the root of your WordPress installation. Inside each manga folder, each chapter should be a subdirectory containing the images of that chapter (e.g., `manga/nameofmanga/chapter1/`).

## Usage

To display a manga reader on a page or post, use the following shortcode, where nameofmanga is the folder name of the manga:

```plaintext
[display_manga name="nameofmanga"]
