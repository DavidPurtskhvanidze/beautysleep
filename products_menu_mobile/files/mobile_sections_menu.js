const sections = document.querySelectorAll(".goods-grid");
const navLinks = document.querySelectorAll(".mobile-section-menu-item");
const seenSections = new Set();
const mainHeader = $('header.header');
const mobileSectionsMenu = $('.mobile-sections-menu');
let lastNavLinksIndex = 0;
let sidebarOffsetTop = 190;

function mobileSectionsMenuPosition() {
    if (mainHeader.hasClass('hide')) {
        mobileSectionsMenu.css('top', 0);
        mobileSectionsMenu.addClass('top');
    } else {
        mobileSectionsMenu.css({'top': mainHeader.height()});
        mobileSectionsMenu.removeClass('top');
    }
}
mobileSectionsMenuPosition();
function highlightMenu() {
    let scrollPosition = window.scrollY + window.innerHeight / 2;
    mobileSectionsMenuPosition();
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition - 200 >= sectionTop && scrollPosition - 200 < sectionTop + sectionHeight) {
            const id = section.getAttribute('id');

            navLinks.forEach((link, index) => {
                link.classList.remove('active');
                if (link.getAttribute('data-section-id') === id) {
                    link.classList.add('active');
                    lastNavLinksIndex = index;
                    if (!seenSections.has(id)) {
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
window.addEventListener("resize", mobileSectionsMenuPosition);

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

        const targetId = link.getAttribute("data-section-id");
        const targetSection = document.getElementById(targetId);
        const shopSection = document.getElementsByClassName("shop-section");
        window.scrollTo({
            top: targetSection.offsetTop + (shopSection[0].offsetTop - sidebarOffsetTop),
            behavior: "smooth"
        });
    });
});
