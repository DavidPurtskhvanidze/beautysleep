document.addEventListener('DOMContentLoaded', function () {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sectionIds = Array.from(sidebarLinks).map(link => link.dataset.sidebar);
    const mainHeader = $('header.header');
    const sidebarBlock = $('.post-sidebar-content');
    const sidebarBlockHeight = sidebarBlock.height();
    const el = document.querySelector('.post-sidebar-content');
    const sections = sectionIds
        .map(id => document.getElementById(id))
        .filter(Boolean);

    function sidebarTopPosition() {
        let offsetTop = el.getBoundingClientRect().top ;

        let sidebarHeight = $(window).height() - offsetTop;
        let sidebarBlockHeightArea = $(window).height() - mainHeader.height();

        sidebarBlock.css({'height': sidebarHeight, 'max-height': sidebarBlockHeightArea - 24});
    }

    sidebarLinks.forEach((link) => {
        link.addEventListener('click', function (e) {
            const targetId = this.dataset.sidebar;
            const target = document.getElementById(targetId);
            if (target) {
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.scrollY - 180,
                    behavior: 'smooth'
                });
            }
        });
    });

    function highlightSidebar() {
        const scrollY = window.scrollY;
        let activeIndex = -1;

        sections.forEach((section, i) => {
            const sectionTop = section.getBoundingClientRect().top + window.scrollY;
            if (scrollY >= sectionTop - 200) {
                activeIndex = i;
            }
        });

        sidebarLinks.forEach((link, i) => {
            if (i <= activeIndex) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', highlightSidebar);
    window.addEventListener('scroll', sidebarTopPosition);

    window.addEventListener('resize', highlightSidebar);
    window.addEventListener('resize', sidebarTopPosition);

    highlightSidebar();
    sidebarTopPosition();
});


