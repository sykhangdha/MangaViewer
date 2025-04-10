jQuery(document).ready(function ($) {
    let currentImages = [];
    let currentIndex = 0;
    let viewType = 'list';
    let allChapters = [];
    let currentChapterIndex = -1;

    const $heading = $('#manga-heading');
    const mangaName = $('.manga-viewer').data('manga-name');

    function showLoadingHeading() {
        $heading.text(`${mangaName} - Loading...`);
    }

    function updateHeading(chapter) {
        const label = chapter === 'Chapters'
            ? 'Chapters'
            : chapter.replace(/[_\-]/g, ' ')
                     .replace(/^(ch(?:apter)?)(\s*\d+)/i, (_, p1, p2) =>
                         p1.charAt(0).toUpperCase() + p1.slice(1) + p2
                     );
        $heading.text(`${mangaName} - ${label}`);
    }

    function loadChapters() {
        updateHeading('Chapters');
        $('#manga-images').hide();
        $('#back-to-chapters, .view-toggle').hide();

        $.post(mangaAjax.ajaxurl, {
            action: 'get_chapters',
            manga: mangaName
        }, function (res) {
            if (res.success) {
                allChapters = res.data.chapters;

                // Sort chapters properly (handles sub-chapters like Ch. 104.4, Ch. 104.3, etc.)
                allChapters.sort((a, b) => {
                    const parseChapter = str => {
                        const match = str.match(/Ch\.?\s*(\d+(?:\.\d+)?)/i);
                        return match ? parseFloat(match[1]) : 0;
                    };
                    return parseChapter(b.name) - parseChapter(a.name);
                });

                const html = allChapters.map(ch => {
                    const name = ch.name;
                    const date = ch.date ? ` <span class="chapter-date">(${ch.date})</span>` : '';
                    return `<li><a href="#" class="chapter-link" data-chapter="${name}">${name}</a>${date}</li>`;
                }).join('');

                $('.chapter-list').html(html).show();
            } else {
                $heading.text(`${mangaName} - No Chapters Available`);
            }
        });
    }

    function loadImages(chapter) {
        showLoadingHeading();

        $.post(mangaAjax.ajaxurl, {
            action: 'get_images',
            manga: mangaName,
            chapter: chapter
        }, function (res) {
            if (res.success) {
                currentImages = res.data;
                currentIndex = 0;
                currentChapterIndex = allChapters.findIndex(c => c.name === chapter);

                renderImages(() => {
                    $('#back-to-chapters, .view-toggle').show();
                    updateHeading(chapter);
                    $('.chapter-list').hide();
                    $('#manga-images').show();
                });
            } else {
                $heading.text(`${mangaName} - Images Not Found`);
            }
        });
    }

    function renderImages(done) {
        const $container = $('#manga-images').empty().show();

        if (viewType === 'list') {
            currentImages.forEach((src, i) => {
                const $img = $('<img>', {
                    src,
                    class: 'manga-image',
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

    function showBottomNav() {
        $('#bottom-chapter-navigation').remove();

        const $nav = $(`
            <div id="bottom-chapter-navigation" style="text-align:center; margin:20px 0;">
                <button id="prev-chapter-bottom">Prev Chapter</button>
                <button id="next-chapter-bottom">Next Chapter</button>
            </div>
        `);

        $('#manga-images').append($nav);

        $('#prev-chapter-bottom').off().on('click', () => {
            if (currentChapterIndex > 0) {
                $('html, body').animate({ scrollTop: 0 }, 400, () => {
                    loadImages(allChapters[currentChapterIndex - 1].name);
                });
            }
        });

        $('#next-chapter-bottom').off().on('click', () => {
            if (currentChapterIndex < allChapters.length - 1) {
                $('html, body').animate({ scrollTop: 0 }, 400, () => {
                    loadImages(allChapters[currentChapterIndex + 1].name);
                });
            }
        });
    }

    $(document).on('click', '.chapter-link', function (e) {
        e.preventDefault();
        const chapter = $(this).data('chapter');
        showLoadingHeading();
        $('html, body').animate({ scrollTop: 0 }, 400, () => {
            loadImages(chapter);
        });
        $('.chapter-list').hide();
    });

    $('#back-to-chapters').on('click', function () {
        $('#manga-images').hide();
        $('#bottom-chapter-navigation').remove();
        $('.chapter-list').show();
        loadChapters();
    });

    $('.view-toggle button').on('click', function () {
        viewType = $(this).data('view');
        if (currentImages.length) {
            renderImages(() => updateHeading(allChapters[currentChapterIndex].name));
        }
    });

    $(document).on('click', '.manga-image', function () {
        const nextImage = $(this).next('.manga-image');
        if (nextImage.length) {
            $('html, body').animate({
                scrollTop: nextImage.offset().top
            }, 300);
        }
    });

    // Start viewer
    loadChapters();
});
