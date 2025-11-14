document.addEventListener('DOMContentLoaded', function() {
    const productModalInfo = document.querySelector('.product-modal-info');
    const productModalSwiperCont = document.querySelector('.product-modal-images .swiper-container');
    productModalSwiperCont.style.height = productModalInfo.clientHeight  + 'px';

    const productModalImagesSwiper = new Swiper(".product-modal-images .swiper-container", {
        spaceBetween: 0,
        slidesPerView: 'auto',
        direction: 'horizontal',
        normalizeSlideIndex: false,
        mousewheel: {
            enabled: true,
            releaseOnEdges: true,
            forceToAxis: true,
            sensitivity: 0.1,
            thresholdDelta: 1,
            thresholdTime: 1,
            invert: true,
        },
        on: {
            init: function () {
                this.update();
            }
        },
        navigation: {
            nextEl: '.product-modal-images .product-next',
            prevEl: '.product-modal-images .product-prev',
        },
        pagination: {
            el: '.product-modal-images .swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: {
                direction : 'vertical',
                spaceBetween: 8,
                autoHeight: true,
            },
        }
    });
});

// --------updateCounters
function updateCounters() {
    const containers = document.querySelectorAll('.slide-product-color-size');
    const isMobile = window.innerWidth < 767;
    const maxColors = isMobile ? 3 : 5;
    const maxSizes = 2; // Всегда максимум 2 размера

    containers.forEach(container => {
        // Обработка цветов
        updateElementGroup(container, 'color', maxColors, 'color-count');

        // Обработка размеров
        updateElementGroup(container, 'size', maxSizes, 'size-count');
    });
}

function updateElementGroup(container, className, maxVisible, counterClass) {
    // Удаляем старый счетчик если есть
    const oldCounter = container.querySelector(`.${counterClass}`);
    if (oldCounter) {
        oldCounter.remove();
    }

    // Показываем все элементы
    const elements = container.querySelectorAll(`.${className}`);
    elements.forEach(element => {
        element.style.display = 'flex'; // или 'block'
    });

    // Если элементов больше максимального количества
    if (elements.length > maxVisible) {
        // Скрываем лишние элементы
        for (let i = maxVisible - (className !== 'size' ? 1:0); i < elements.length; i++) {
            elements[i].style.display = 'none';
        }

        // Создаем счетчик
        const counter = document.createElement('div');
        counter.className = counterClass;
        const hiddenCount = elements.length - (maxVisible - 1);
        counter.textContent = `+${hiddenCount}`;

        // Вставляем счетчик вместо последнего видимого элемента
        if (elements[maxVisible - 1] && className !== 'size') {
            elements[maxVisible - 1].after(counter);
        }
    }
}

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', updateCounters);

// Запускаем при изменении размера окна
window.addEventListener('resize', updateCounters);
// --------updateCounters

function updateHeaderHeight() {
    // Проверяем ширину окна
    if (window.innerWidth < 767) {
        const header = document.querySelector('.header');
        if (header) {
            let headerHeight;

            // Проверяем наличие класса hide
            if (header.classList.contains('hide')) {
                headerHeight = '50px';
            } else {
                headerHeight = header.offsetHeight + 'px';
            }

            document.documentElement.style.setProperty('--header-height', headerHeight);
            console.log('Header height updated:', headerHeight, header.classList.contains('hide') ? '(hide class)' : '');
        }
    } else {
        // На десктопе удаляем переменную
        document.documentElement.style.removeProperty('--header-height');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateHeaderHeight();
});

// Обновление при ресайзе (с debounce для оптимизации)
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateHeaderHeight, 100);
});

// Обновление при полной загрузке страницы
window.addEventListener('load', function() {
    updateHeaderHeight();
});

// Обновление при скролле (с throttle для оптимизации)
let scrollTimeout;
window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateHeaderHeight, 50); // Более быстрый отклик для скролла
});

////////////////

function moveToCardAnimation(id) {
    const productImg = $("[data-viewproduct='" + id + "']").find('.slide-product__img a img').first();
    const startOffset = productImg.offset();
    const cartOffset = $(".header__cart-link").offset();

    console.log(startOffset, cartOffset.left);
    const $clone = productImg
        .clone()
        .css({
            position: "absolute",
            "z-index": 10,
            top: startOffset.top,
            left: startOffset.left,
            width: productImg.width(),
            "border-radius": 0,
            opacity: 1
        })
        .appendTo("body");
    $clone.animate({
        top: startOffset.top + 40
    }, {
        duration: 200,
        easing: "swing",
        complete: function () {
            $clone.animate({
                left: cartOffset.left,
                top: cartOffset.top,
                width: 20,
                "border-radius": 6,
                opacity: 0.7
            }, {
                duration: 300,
                easing: "linear",
                complete: function () {
                    $clone.remove();
                }
            });
        }
    });
}
