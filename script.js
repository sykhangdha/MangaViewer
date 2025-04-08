jQuery(document).ready(function($) {
    let currentImages = [];
    let currentIndex = 0;
    let viewType = 'list';
    let allChapters = [];
    let currentChapterIndex = -1;

    const $heading = $('#manga-heading');
    const mangaName = $('.manga-viewer').data('manga-name');

    // Set heading to "Manga â€“ Loading..."
    function showLoadingHeading() {
        $heading.text(`${mangaName} - Loading...`);
    }

    // Set heading to "Manga â€“ Chapter"
    function updateHeading(chapter) {
        const label = chapter === 'Chapters'
            ? 'Chapters'
            : chapter.replace(/[_\-]/g, ' ')
                     .replace(/^(ch(?:apter)?)(\s*\d+)/i, (_, p1, p2) =>
                         p1.charAt(0).toUpperCase() + p1.slice(1) + p2
                     );
        $heading.text(`${mangaName} - ${label}`);
    }

    // Fetch chapter list
    function loadChapters() {
        updateHeading('Chapters');
        $('#manga-images').hide();
        $('#back-to-chapters, .view-toggle').hide();

        $.post(mangaAjax.ajaxurl, {
            action: 'get_chapters',
            manga: mangaName
        }, function(res) {
            if (res.success) {
                allChapters = res.data.chapters;
                const html = allChapters.map(ch =>
                    `<li><a href="#" class="chapter-link" data-chapter="${ch}">${ch}</a></li>`
                ).join('');
                $('.chapter-list').html(html).show();
            } else {
                // Handle error if chapters are not found
                $heading.text(`${mangaName} - No Chapters Available`);
            }
        });
    }

    // Fetch images for a chapter
    function loadImages(chapter) {
        showLoadingHeading(); // Set loading heading

        $.post(mangaAjax.ajaxurl, {
            action: 'get_images',
            manga: mangaName,
            chapter: chapter
        }, function(res) {
            if (res.success) {
                currentImages = res.data;
                currentIndex = 0;
                currentChapterIndex = allChapters.indexOf(chapter);

                renderImages(() => {
                    $('#back-to-chapters, .view-toggle').show();
                    updateHeading(chapter);
                    $('.chapter-list').hide(); // Hide chapter list after chapter is selected
                    $('#manga-images').show(); // Ensure images container is shown
                });
            } else {
                // Handle error if images are not found
                $heading.text(`${mangaName} - Images Not Found`);
            }
        });
    }

    // Render images (list or paged) with fade-in
    function renderImages(done) {
        const $container = $('#manga-images').empty().show();

        if (viewType === 'list') {
            currentImages.forEach((src, i) => {
                const $img = $('<img>', {
                    src, class: 'manga-image',
                    css: { marginBottom: '20px', display: 'none' }
                }).on('load', () => $img.fadeIn(300 + i * 50));
                $container.append($img);
            });
            showBottomNav();
            done();
        } else {
            const $img = $('<img>', {
                src: currentImages[currentIndex],
                class: 'manga-image',
                css: { display: 'none' }
            }).on('load', () => $img.fadeIn(300));
            $container.append($img);

            $container.append(`
                <div class="paged-controls">
                  <button id="prev-page">Prev</button>
                  <span>Page ${currentIndex + 1} of ${currentImages.length}</span>
                  <button id="next-page">Next</button>
                </div>
            `);

            $('#prev-page').off().on('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    renderImages(done);
                }
            });
            $('#next-page').off().on('click', () => {
                if (currentIndex < currentImages.length - 1) {
                    currentIndex++;
                    renderImages(done);
                }
            });
            $img.on('click', () => {
                if (currentIndex < currentImages.length - 1) {
                    currentIndex++;
                    renderImages(done);
                }
            });

            showBottomNav();
            done();
        }
    }

    // Bottom Prev/Next chapter buttons only
    function showBottomNav() {
        $('#bottom-chapter-navigation').remove();
        const $nav = $(` 
            <div id="bottom-chapter-navigation" style="text-align:center; margin:20px 0;">
              <button id="prev-chapter-bottom">Prev Chapter</button>
              <button id="next-chapter-bottom">Next Chapter</button>
            </div>
        `);
        $('#manga-images').append($nav);

        // Swapped the functions here
        $('#prev-chapter-bottom').off().on('click', () => {
            if (currentChapterIndex < allChapters.length - 1) {  // Changed condition to load next chapter
                showLoadingHeading();
                $('html, body').animate({ scrollTop: 0 }, 400, () => {
                    loadImages(allChapters[currentChapterIndex + 1]);  // Load next chapter
                });
            }
        });
        $('#next-chapter-bottom').off().on('click', () => {
            if (currentChapterIndex > 0) {  // Changed condition to load previous chapter
                showLoadingHeading();
                $('html, body').animate({ scrollTop: 0 }, 400, () => {
                    loadImages(allChapters[currentChapterIndex - 1]);  // Load previous chapter
                });
            }
        });
    }

    // Chapter list click
    $(document).on('click', '.chapter-link', function(e) {
        e.preventDefault();
        const chap = $(this).data('chapter');
        showLoadingHeading(); // Show loading heading while images are fetched
        $('html, body').animate({ scrollTop: 0 }, 400, () => {
            loadImages(chap); // Load the images for the selected chapter
        });
        $('.chapter-list').hide(); // Immediately hide chapter list after a chapter is clicked
    });

    // Back to chapters
    $('#back-to-chapters').on('click', function() {
        $('#manga-images').hide();
        $('#bottom-chapter-navigation').remove();
        $('.chapter-list').show(); // Show chapter list again
        loadChapters(); // Reload chapters when going back
    });

    // View toggle
    $('.view-toggle button').on('click', function() {
        viewType = $(this).data('view');
        if (currentImages.length) {
            renderImages(() => updateHeading(allChapters[currentChapterIndex]));
        }
    });

    // Click on image to go down to the next one in list view
    $(document).on('click', '.manga-image', function() {
        const nextImage = $(this).next('.manga-image');
        if (nextImage.length) {
            $('html, body').animate({
                scrollTop: nextImage.offset().top
            }, 300);
        }
    });

    // Kickoff
    loadChapters(); // Load chapter list initially
});
