const sections = document.querySelectorAll(".goods-grid");
const navLinks = document.querySelectorAll(".shop-section__goods_item_action");
const seenSections = new Set();
const mainHeader = $('header.header');
const shopSidebarBlock = $('.shop-section .shop-section__goods_sidebar > div');
let lastNavLinksIndex = 0;
let sidebarOffsetTop = 190;

console.log('hey');

function sidebarTopPosition() {
    let sidebarHeight = $(window).height() - mainHeader.height();
    if (mainHeader.hasClass('hide')) {
        shopSidebarBlock.css('top', 0);
    } else {
        shopSidebarBlock.css({'top': mainHeader.height(),'overflow-y':'auto','height': window.innerWidth > 1278 ? sidebarHeight : 'auto'});
    }
}
sidebarTopPosition();
function highlightMenu() {
    let scrollPosition = window.scrollY + window.innerHeight / 2;
    sidebarTopPosition();
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition - 200 >= sectionTop && scrollPosition - 200 < sectionTop + sectionHeight) {
            const id = section.getAttribute('id');

            navLinks.forEach((link, index) => {
                link.classList.remove('active');
                if (link.getAttribute('data-id') === id) {
                    link.classList.add('active');
                    lastNavLinksIndex = index;
                    if (window.innerWidth < 1279 && !seenSections.has(id)) {
                        seenSections.add(id);
                        link.scrollIntoView({
                            behavior: 'smooth',
                            inline: 'start',
                        });
                    }
                }
            });
        } else {
            seenSections.delete(section.getAttribute('id'));
        }
    });
}

window.addEventListener("scroll", highlightMenu);
window.addEventListener("resize", sidebarTopPosition);

navLinks.forEach((link, index) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();

        // calculations based on moving up and down the list
        if (index > lastNavLinksIndex) {
            if(window.innerWidth > 1024) {
                //moving down
                sidebarOffsetTop = 153;
            } else {
                //moving up
                sidebarOffsetTop = index == 0 ? 153 : 68;
            }
        } else if (index < lastNavLinksIndex) {
            //moving up
            sidebarOffsetTop = 153;
        }
        lastNavLinksIndex = index;

        const targetId = link.getAttribute("data-id");
        const targetSection = document.getElementById(targetId);
        const shopSection = document.getElementsByClassName("shop-section");
        window.scrollTo({
            top: targetSection.offsetTop + (shopSection[0].offsetTop - sidebarOffsetTop),
            behavior: "smooth"
        });
    });
});

$(document).ready(function() {
    $('.js-product-color').each(function(index) {
        const label = $(this).find('label');
        const colorOverlay = $(this).find('.color-overlay');
        const labelCount = label.length;
        label.each(function(index) {
            $(this).addClass('lb-color-' + (index + 1));
            //$(this).parent().addClass('lb-size-' + (index + 1));
            $(this).find('.single-product-hints__size .list .input-parent').addClass('lb-size-' + (index + 1));
        });
        if (labelCount > 5) {
            $(this).addClass("collapse");
            $(this).find('.slide-product__img_colors').append('<div class="more-color-count">'+ (labelCount - 4) +'</div>');
            $(this).find('.single-product-hints__size .list').append('<div class="more-size-count">'+ (labelCount - 4) +'</div>');

            const form = $(this).closest('form');
            const oldBtn = form.find('button.btn-add-basket');
            oldBtn.hide();
            oldBtn.after(`
                <a type="button" 
                    class="button border x_gradient single-product__to-card to-card btn btn-buy btn-add-basket action-basket show">
                    <span>опции</span> 
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 21.7383L3 9.73828H21L18 21.7383H6Z" stroke="#221D1E"></path>
                        <path d="M16.4446 7.55556C16.4446 3.92353 14.4547 2 12.0001 2C9.5455 2 7.55566 3.92944 7.55566 7.55556" stroke="#221D1E"></path>
                        <path d="M14.7695 15.7383H9.22686" stroke="black" stroke-linecap="round"></path>
                        <path d="M12 18.5095L12 12.9668" stroke="black" stroke-linecap="round"></path>
                    </svg>
                </a>
            `);
            /*const newBtn = oldBtn.clone().attr({
                type: 'a',
                name: 'ms2_action2',
                value: 'cart/add2'
            }).removeAttr('onclick');

            newBtn.find('span').text('опции');
            oldBtn.replaceWith(newBtn);*/


        } else {
            console.log("hidden");
            colorOverlay.hide();
        }
    });


    $(".js-product-color.collapse").click(function() {
        const productColor = $(this).closest(".js-product-color");
        productColor.removeClass("collapse");
        productColor.find(".color-overlay").hide();

        const form = $(this).closest('form');
        const buttonBasket = form.find("button.btn-add-basket");

        if (buttonBasket.length > 0) {
            form.find("a.btn-add-basket").hide();
            buttonBasket.show();
        }
    });

    $("a.btn-add-basket").click(function() {
        const href = $(this).attr("href");
        if (href && href !== "") {
            return true;
        }

        const form = $(this).closest('form');
        const productColor = form.find(".js-product-color");
        productColor.removeClass("collapse");
        productColor.find(".color-overlay").hide();
        form.find("a.btn-add-basket").hide();
        form.find("button.btn-add-basket").show();
    });


    miniShop2.Callbacks.add('Cart.add.ajax.always', 'ajax_log', function (xhr) {
        $(".header__cart-counter").text(xhr["responseJSON"]["data"]["total_count"]);
    });
    miniShop2.Callbacks.add('Cart.remove.ajax.always', 'ajax_log', function (xhr) {
        $(".header__cart-counter").text(xhr["responseJSON"]["data"]["total_count"]);
    });
    miniShop2.Callbacks.add('Cart.change.ajax.always', 'ajax_log', function (xhr) {
        $(".header__cart-counter").text(xhr["responseJSON"]["data"]["total_count"]);
    });

})


$(document).ready(function() {
    // Функция для получения параметра из URL
    function getUrlParameter(name) {
        name = name.replace(/[\[\]]/g, '\\$&');
        let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        let results = regex.exec(window.location.href);
        if (!results || !results[2]) return null;
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    // Получаем значение category
    let categoryId = getUrlParameter('categories');

    // Если параметр есть — кликаем по соответствующему элементу
    if (categoryId) {
        let selector = '.shop-section__goods_item_action[data-category-id="' + categoryId + '"]';
        let $target = $(selector);

        if ($target.length) {
            $target.click(); // или .trigger('click')
        }
    }
});