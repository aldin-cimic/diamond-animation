/**
 * Diamond Reveal Animation
 * Reveals a background image through a diamond-shaped mask as user scrolls
 */

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    initDiamondReveal();
});

function initDiamondReveal() {
    const section = document.querySelector('[data-animation="star-mask"]');
    const maskBlock = document.querySelector('[data-mask-block]');
    
    if (!section || !maskBlock) {
        console.warn('Diamond reveal elements not found');
        return;
    }

    // Get viewport dimensions
    const getViewportSize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        // Calculate diagonal dimension to ensure full coverage
        const diagonal = Math.sqrt(width * width + height * height);
        // Multiply by 15 to ensure the mask covers the entire viewport and image
        return diagonal * 15;
    };

    // Calculate maximum mask size (should cover entire viewport)
    const maxMaskSize = getViewportSize();

    // Initial mask size
    maskBlock.style.maskSize = '0px';
    maskBlock.style.webkitMaskSize = '0px';

    // Create ScrollTrigger animation
    gsap.to(maskBlock, {
        maskSize: `${maxMaskSize}px`,
        WebkitMaskSize: `${maxMaskSize}px`,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=400%', // Scroll distance for reveal (400% of viewport height - longer duration)
            scrub: true, // Smooth scrubbing based on scroll position
            pin: false, // Don't pin, let it scroll naturally
            onEnter: () => {
                maskBlock.classList.add('mask-active');
            },
            onLeave: () => {
                maskBlock.classList.add('mask-active');
            },
            onEnterBack: () => {
                maskBlock.classList.add('mask-active');
            },
            onLeaveBack: () => {
                maskBlock.classList.remove('mask-active');
            }
        }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });
}

