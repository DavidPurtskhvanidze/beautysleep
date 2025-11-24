function adjustMenuItemsPadding() {
    // Проверяем ширину экрана
    if (window.innerWidth > 1280) return;

    const container = document.querySelector('.shop-section__goods_sidebar > div');
    const items = document.querySelectorAll('.shop-section__goods_item_action');

    if (!container || items.length === 0) return;

    // Сбрасываем предыдущие padding
    items.forEach(item => {
        const goodsItem = item.querySelector('.shop-section__goods_item');
        if (goodsItem) {
            goodsItem.style.paddingLeft = '';
            goodsItem.style.paddingRight = '';
        }
    });

    // Получаем реальные размеры контейнера
    const containerRect = container.getBoundingClientRect();
    const containerWidth = (containerRect.width) - 14;
    console.log(containerWidth)

    let totalWidth = 0;
    let visibleItemsCount = 0;

    // Подсчитываем, сколько элементов полностью помещается
    for (let i = 0; i < items.length; i++) {
        const itemRect = items[i].getBoundingClientRect();
        const itemWidth = itemRect.width + 14; // + padding между элементами

        if (totalWidth + itemWidth <= containerWidth) {
            totalWidth += itemWidth;
            visibleItemsCount = i + 1;
        } else {
            break;
        }
    }

    // Если все элементы помещаются или только один не помещается - не делаем ничего
    if (visibleItemsCount >= items.length - 1) return;

    // Вычисляем необходимый дополнительный padding
    const nextItemIndex = visibleItemsCount;
    const nextItem = items[nextItemIndex];
    const nextItemRect = nextItem.getBoundingClientRect();

    // Сколько пикселей следующего элемента видно
    const visiblePartOfNextItem = containerWidth - totalWidth;

    // Если видно слишком много следующего элемента, добавляем padding
    const minVisiblePart = 100; // Минимальная видимая часть следующего элемента (в пикселях)

    if (visiblePartOfNextItem > minVisiblePart) {
        const paddingToAdd = (visiblePartOfNextItem - minVisiblePart) / (visibleItemsCount + 1);

        // Применяем padding ко всем элементам
        items.forEach((item, index) => {
            const goodsItem = item.querySelector('.shop-section__goods_item');
            const currentPadding = parseFloat(getComputedStyle(goodsItem).paddingLeft) || 0;
            goodsItem.style.paddingLeft = `${currentPadding + paddingToAdd}px`;
            goodsItem.style.paddingRight = `${currentPadding + paddingToAdd}px`;
            // if (goodsItem && index <= visibleItemsCount) {
            //     const currentPadding = parseFloat(getComputedStyle(goodsItem).paddingLeft) || 0;
            //     goodsItem.style.paddingLeft = `${currentPadding + paddingToAdd}px`;
            //     goodsItem.style.paddingRight = `${currentPadding + paddingToAdd}px`;
            // }
        });
    }
}

// Запускаем при загрузке и изменении размера окна
window.addEventListener('load', adjustMenuItemsPadding);
window.addEventListener('resize', adjustMenuItemsPadding);

// Также можно использовать ResizeObserver для более точного отслеживания изменений
if (typeof ResizeObserver !== 'undefined') {
    const container = document.querySelector('.shop-section__goods_sidebar > div');
    if (container) {
        const resizeObserver = new ResizeObserver(adjustMenuItemsPadding);
        resizeObserver.observe(container);
    }
}

//
//
//
//
//
//
//
//
//
//
//
//

function demonstrateHorizontalScroll() {
    const container = document.querySelector('.shop-section__goods_sidebar > div');

    if (!container) return;

    // Проверяем, есть ли необходимость в скролле (контент шире контейнера)
    const isScrollable = container.scrollWidth > container.clientWidth;

    if (!isScrollable) return;

    // Настройки анимации
    const config = {
        scrollAmount: 100, // На сколько пикселей прокручивать
        duration: 400,     // Длительность одной анимации (вперед+назад) в ms
        repetitions: 2,    // Количество повторений (туда-обратно = 1 повторение)
        delayBetween: 600  // Задержка между повторениями в ms
    };

    let currentRepetition = 0;

    function performScroll() {
        if (currentRepetition >= config.repetitions) return;

        currentRepetition++;

        // Сохраняем начальную позицию скролла
        const startScrollLeft = container.scrollLeft;

        // Анимация прокрутки вперед
        const scrollForward = () => {
            const targetScroll = startScrollLeft + config.scrollAmount;
            animateScroll(container, targetScroll, config.duration / 2, () => {
                // После прокрутки вперед - возвращаем обратно
                setTimeout(() => {
                    animateScroll(container, startScrollLeft, config.duration / 2, () => {
                        // После завершения цикла - проверяем是否需要 следующее повторение
                        setTimeout(() => {
                            performScroll();
                        }, config.delayBetween);
                    });
                }, 200); // небольшая пауза в крайней точке
            });
        };

        scrollForward();
    }

    // Функция для плавной анимации скролла
    function animateScroll(element, target, duration, callback) {
        const start = element.scrollLeft;
        const change = target - start;
        const startTime = performance.now();

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // easing function для плавности
            const easeInOut = progress < 0.5
                ? 2 * progress * progress
                : -1 + (4 - 2 * progress) * progress;

            element.scrollLeft = start + change * easeInOut;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                if (callback) callback();
            }
        }

        requestAnimationFrame(animate);
    }

    // Запускаем анимацию после небольшой задержки, чтобы страница полностью загрузилась
    setTimeout(() => {
        performScroll();
    }, 1000);
}

// Альтернативная версия с более простой анимацией (если нужен простой вариант)
function demonstrateHorizontalScrollSimple() {
    const container = document.querySelector('.shop-section__goods_sidebar > div');

    if (!container) return;

    // Проверяем, нужен ли скролл
    const isScrollable = container.scrollWidth > container.clientWidth;
    if (!isScrollable) return;

    // Настройки
    const config = {
        scrollAmount: 80,
        repetitions: 3,
        delay: 400
    };

    let count = 0;

    function scrollCycle() {
        if (count >= config.repetitions * 2) return; // *2 потому что туда и обратно

        const isForward = count % 2 === 0;
        const targetScroll = isForward
            ? container.scrollLeft + config.scrollAmount
            : container.scrollLeft - config.scrollAmount;

        container.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });

        count++;
        setTimeout(scrollCycle, config.delay);
    }

    // Запускаем после загрузки страницы
    setTimeout(scrollCycle, 1500);
}

// Запускаем при полной загрузке страницы
window.addEventListener('load', function() {
    // Можно выбрать одну из версий:
    demonstrateHorizontalScroll(); // Более продвинутая версия с кастомной анимацией
    // demonstrateHorizontalScrollSimple(); // Простая версия с нативным smooth scroll
});

// Дополнительно: можно запустить при первом взаимодействии пользователя
// document.addEventListener('click', function initOnInteraction() {
//     demonstrateHorizontalScroll();
//     document.removeEventListener('click', initOnInteraction);
// }, { once: true });