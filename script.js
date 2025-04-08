jQuery(document).ready(function($) {
    let viewType = 'list';
    let currentImages = [];
    let currentIndex = 0;
    let currentPage = 0;

    const viewer = $('.manga-viewer');
    const manga = viewer.data('manga-name');

    function loadChapters(page = 0) {
        $.post(mangaAjax.ajaxurl, {
            action: 'get_chapters',
            manga: manga,
            page: page
        }, function(response) {
            if (response.success) {
                const list = viewer.find('.chapter-list');
                list.empty();
                response.data.chapters.forEach(chap => {
                    list.append(`<li><a href="#" class="chapter-link" data-chapter="${chap}">${chap}</a></li>`);
                });
                viewer.find('.chapter-page-number').text(`Page ${response.data.page}`);
                currentPage = page;
            } else {
                alert('Failed to load chapters.');
            }
        });
    }

    function loadImages(chapter) {
        $.post(mangaAjax.ajaxurl, {
            action: 'get_images',
            manga: manga,
            chapter: chapter
        }, function(response) {
            if (response.success) {
                currentImages = response.data;
                currentIndex = 0;
                renderImages(viewType);
            } else {
                alert('Failed to load images.');
            }
        });
    }

    function renderImages(view) {
        const container = $('#manga-images');
        container.empty();

        if (view === 'list') {
            const listDiv = $('<div class="manga-image-list"></div>');
            currentImages.forEach(img => {
                listDiv.append(`<img src="${img}" alt="">`);
            });
            container.append(listDiv);
        } else {
            const viewDiv = $('<div class="manga-paged-view"></div>');
            viewDiv.append(`<img src="${currentImages[currentIndex]}" alt="">`);
            const controls = $(`
                <div class="paged-controls">
                    <button id="prev-page">Previous</button>
                    <span>Page ${currentIndex + 1} of ${currentImages.length}</span>
                    <button id="next-page">Next</button>
                </div>
            `);
            container.append(viewDiv).append(controls);

            $('#prev-page').click(() => {
                if (currentIndex > 0) {
                    currentIndex--;
                    renderImages(viewType);
                }
            });
            $('#next-page').click(() => {
                if (currentIndex < currentImages.length - 1) {
                    currentIndex++;
                    renderImages(viewType);
                }
            });
        }
    }

    viewer.on('click', '.chapter-link', function(e) {
        e.preventDefault();
        const chapter = $(this).data('chapter');
        loadImages(chapter);
    });

    viewer.find('.view-toggle button').click(function() {
        viewType = $(this).data('view');
        if (currentImages.length > 0) {
            renderImages(viewType);
        }
    });

    viewer.find('.next-chapter-page').click(function() {
        loadChapters(currentPage + 1);
    });

    viewer.find('.prev-chapter-page').click(function() {
        if (currentPage > 0) {
            loadChapters(currentPage - 1);
        }
    });

    loadChapters(); // initial load
});
