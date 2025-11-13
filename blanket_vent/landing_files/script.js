//for Diff slider
document.addEventListener('DOMContentLoaded', () => {
    const overlays = document.querySelectorAll('.vent-different-comp-overlay');

    overlays.forEach(overlay => {
        const container = overlay.parentElement;
        const width = container.offsetWidth;
        const height = container.offsetHeight;

        overlay.style.width = width / 1.3 + 'px';

        const slider = document.createElement('div');
        slider.className = 'vent-different-comp-slider';
        container.insertBefore(slider, overlay);
        slider.style.top = height / 2 - slider.offsetHeight / 2 + 'px';
        slider.style.left = width / 1.3 - slider.offsetWidth / 2 + 'px';

        container.addEventListener('mousemove', e => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const pos = Math.min(Math.max(0, x), width);
            updateSlider(pos);
        });

        container.addEventListener('touchmove', e => {
            const rect = container.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const pos = Math.min(Math.max(0, x), width);
            updateSlider(pos);
        });

        function updateSlider(x) {
            overlay.style.width = x + 'px';
            slider.style.left = x - slider.offsetWidth / 2 + 'px';
        }
    });
});

//for lines animation
window.addEventListener("DOMContentLoaded", () => {
    const icons = document.querySelectorAll(".vent-how-degradation-list li");
    const paths = document.querySelectorAll(".vent-how-degradation-list-lines .line");
    const pathGray = document.querySelector("#how-degradation-gray .line");
    const stickyContainerParent = document.querySelector('.vent-how-degradation-section');
    const stickyContainer = document.querySelector(".vent-how-degradation-sticky");
    const headerHeight = document.querySelector("header.header").offsetHeight;


    const updateSizes = () => {
        if (window.innerWidth >= 768) {
            stickyContainerParent.style.height = (stickyContainer.offsetHeight * 2.6) + 'px';
            stickyContainer.style.top = headerHeight + 'px';
        }
    }

    const initDashArrays = () => {
        pathGray.style.strokeDasharray = pathGray.getTotalLength();
    };

    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".vent-how-degradation-section",
            start: "top top+=50%",
            end: "bottom bottom",
            scrub: true,
        }
    });

    const ACTIVATE_AT  = 0.999;
    const DELTA_REVERSE = 0.001;

    paths.forEach((item, index) => {
        const length = item.getTotalLength();
        gsap.set(item, {
            strokeDasharray: length,
            strokeDashoffset: length - 1
        });

        const iconEl = icons[index];
        const state  = { prev: 0, active: false };

        tl.to(item, {
            strokeDashoffset: 0,
            duration: 1.3,
            ease: "none",
            onUpdate: function () {
                if (!iconEl) return;

                const p = this.progress();

                if (!state.active && p >= ACTIVATE_AT) {
                    iconEl.classList.add("active");
                    state.active = true;
                }
                if (state.active && p < state.prev - DELTA_REVERSE) {
                    iconEl.classList.remove("active");
                    state.active = false;
                }
                state.prev = p;
            }
        }, index);
    });


    const updateDashOffset = () => {
        if (window.innerWidth <= 768) {
            const rect = document.querySelector("#how-degradation-gray").getBoundingClientRect();

            const startPosition = rect.top - 50;
            const endPosition = window.innerHeight - rect.height - 50 * 2;

            const progress = Math.max(0, Math.min(1, startPosition / endPosition));
            const offset = pathGray.getTotalLength() * progress;

            pathGray.style.strokeDashoffset = offset;


            icons.forEach((icon, index) => {
                let threshold;

                if (index === 0) {
                    threshold = 0.97;
                } else if (index === 1) {
                    threshold = 0.70;
                } else if (index === 2) {
                    threshold = 0.35;
                } else {
                    threshold = 0.01;
                }

                if (progress < threshold) {
                    icon.classList.add("active");
                } else {
                    icon.classList.remove("active");
                }
            });
        }

    };

    window.addEventListener("resize", updateSizes);
    window.addEventListener("resize", updateDashOffset);
    window.addEventListener("scroll", updateDashOffset);

    updateSizes();
    initDashArrays();
    updateDashOffset();
});

//for switch tabs
window.addEventListener("DOMContentLoaded", () => {
    const ventMeshButtons = document.querySelectorAll(".vent-mesh-position-switch-btn");
    const ventMeshBlocks  = [document.getElementById("fnSingleVent"), document.getElementById("fnDoubleVent")];

    document.addEventListener("click", e => {
        const btn = e.target.closest(".vent-mesh-position-switch-btn");
        if (!btn) return;

        ventMeshButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        ventMeshBlocks.forEach(block => block.classList.remove("active"));
        document.getElementById(btn.dataset.target)?.classList.add("active");
    });
});

//for video
window.addEventListener("DOMContentLoaded", () => {
    function setVideoSources() {
        const isMobile = window.innerWidth <= 768;
        const videos = document.querySelectorAll("video");

        videos.forEach(video => {
            const sources = video.querySelectorAll("source");

            sources.forEach(source => {
                const src = isMobile ? source.dataset.mobile : source.dataset.desktop;
                if (src) source.src = src;
            });

            video.load();
        });
    }
    setVideoSources();
});


