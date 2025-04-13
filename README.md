# 📖 FluentDex + Manga Viewer Plugin

A modern, responsive WordPress theme designed for manga reading websites, inspired by MangaDex. This project includes a custom **Manga Viewer plugin** that renders manga chapters using AJAX and a shortcode system. Designed for speed, simplicity, and clean navigation.
Currently still a W.I.P. View the [DEMO HERE](https://skymanga.42web.io/)
---

## 🧾 How It Works

### 🗂️ Folder-Based Manga System

This system reads manga directly from folders in your site's root `/manga/` directory.

<pre> <code> /manga/
└── My-Manga-Series/
    ├── cover.jpg
    ├── Ch. 1/
    │   ├── 001.jpg
    │   └── 002.jpg
    └── Ch. 2/
        └── 001.jpg </pre>


> 🔁 Replace `My-Manga-Series` with the name of your manga folder.

---

## 📖 What the Viewer Shows

- ✅ The **cover** (if available)
- ✅ A **list of chapters** (sorted automatically)
- ✅ Toggleable **List View** and **Paged View** reading modes
- ✅ **Bottom navigation** to move between chapters

---

## 🚀 Features

- 📁 **Folder-Based Manga Management** – Reads directly from `/manga/` directory.
- ⚡ **AJAX-Powered Chapter Loading** – Seamless, fast transitions between chapters.
- 🖼️ **Paged & List View Modes** – View chapters one image at a time or all at once.
- 📅 **Automatic Upload Dates** – Chapter lists show upload dates from the file system.
- 🏠 **Custom Homepage Layout** – Showcases latest manga, announcements, and chapter updates.
- 🧩 **Integrated Plugin Settings** – Manage manga scan and cache via admin panel.
- 🖌️ **Modern UI** – Responsive layout with Fluent Design-inspired visuals based on mangadex

---
---

## 🛠️ Manga Viewer Settings

After activating the plugin, go to:

**WP Admin → Settings → Manga Viewer**

### Available Options(more coming soon)

- 🔁 **Scan for Mangas**  
  Click this button to **rescan your `/manga/` directory** and update the available manga/chapter listings on your site.

---

## 📚 Manga Library (Below the Announcement Bar)
- This section displays the **manga grid** where users can browse available series.
  - **Manga Titles**: Displayed in a grid layout, each with the title and a clickable link to view the manga's chapters.
  - **Manga Covers**: Each manga entry includes the **cover image** pulled from the `/manga/{manga_name}/cover.jpg` directory, styled to appear with a hover effect for better interactivity.
  - **Latest Chapter**: Each manga entry shows the **latest chapter** available, alongside the **chapter date**, making it easy for users to know when new chapters have been added.
- This manga library is **responsive**, meaning that on smaller screens, it will adjust the grid layout and ensure each manga entry remains easy to read and click.

## 📖 Reader Page (Manga Viewer)
- The manga reader page adopts a layout inspired by **MangaDex’s old reader style**, where:
  - **Manga Images on the Left**: The manga pages are shown in a **centered** layout with a fixed width of **1600px** to ensure an optimal reading experience. The images remain **consistent in size** regardless of the screen size, maintaining a pleasant aspect ratio.
  - **Chapter List Sidebar on the Right**: 
    - This sidebar **appears when a chapter is loaded** and includes:
      - **Paged/List view toggle** for users to switch between a paged view (one image per page) and a list view (multiple images stacked vertically).
      - A **chapter list** with all available chapters for the manga, displayed as clickable items.
      - A **'Back to Home' button** at the bottom of the sidebar, allowing users to return to the homepage with ease.
  - **Responsive Design**: 
    - On mobile devices, the **manga images** will stack vertically to fit smaller screens, and the **chapter list** will move below the images to maintain the reading flow without interruption.
    - **CSS Flexbox** and **media queries** are used to ensure the layout adapts dynamically across screen sizes.

## 🖌️ CSS Design (`style-manga.css`)
The `style-manga.css` defines the look and feel of the theme. Here’s an overview of its important sections:

- **Responsive Manga Library Grid**:
  - The manga grid is styled using **Flexbox**, allowing the manga entries to resize and align based on the screen width. The entries will be displayed in a neat grid format for large screens and stack into columns for smaller devices.
  - The **cover images** have **hover effects** for better interactivity, such as scaling the image slightly or adding a subtle shadow.
  - The manga titles and chapter dates are styled to ensure they remain **legible and clickable**.

- **Reader Page Layout**:
  - The **manga images** are set to **max-width: 100%**, ensuring that they adapt to the page's layout without overflowing.
  - The **left-side manga container** has a fixed width of **1600px**, making the reader experience consistent and comfortable on larger screens. The right-side chapter list is contained within a flexible sidebar, which will adjust when the view switches from desktop to mobile.
  - **Paged/List View Toggle** is handled using a simple **flexbox layout**, providing an easy-to-use interface for users to choose their preferred viewing mode.

- **Sidebar for Manga Navigation**:
  - The sidebar is designed to be **compact yet functional**, allowing users to quickly switch between chapters. It **hides by default** until a chapter is loaded, preventing clutter on the page. The chapter list is also **dynamically generated** based on the manga's folder contents.
  - The **Back to Home button** has custom styles that make it stand out but remain unobtrusive.

### 📖 The Reader Page

- A clean, minimal reading interface with **toggleable views** and **chapter navigation**
- A fully **responsive layout** for both desktop and mobile
- A **Return to Homepage** button for smooth navigation

---

## 📎 Credits

Built by **HaSky**  
Inspired by the original **MangaDex** layout  
Powered by **WordPress + jQuery + AJAX**


# [DEMO HERE](https://skymanga.42web.io/manga/yotsuba/)
