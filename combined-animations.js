/**
 * Combined Star Mask Animations
 * Includes both Diamond Reveal and Concentric Circles effects
 * 
 * Usage: Include this file after GSAP and ScrollTrigger are loaded
 */

// Register ScrollTrigger plugin
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllAnimations);
} else {
    initAllAnimations();
}

function initAllAnimations() {
    initDiamondReveal();
    initConcentricCircles();
}

/**
 * Diamond Reveal Animation
 */
function initDiamondReveal() {
    const section = document.querySelector('[data-animation="star-mask"]');
    const maskBlock = document.querySelector('[data-mask-block]');
    
    if (!section || !maskBlock) {
        return;
    }

    // Get viewport dimensions
    const getViewportSize = () => {
        return Math.max(window.innerWidth, window.innerHeight);
    };

    // Calculate maximum mask size (should cover entire viewport)
    const maxMaskSize = getViewportSize() * 3; // 3x viewport for smooth reveal

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
            end: '+=200%', // Scroll distance for reveal (200% of viewport height)
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
}

/**
 * Concentric Circles Animation
 */
function initConcentricCircles() {
    const section = document.querySelector('[data-counter-block]');
    const circles = document.querySelectorAll('[data-circle]');
    const counterNumber = document.querySelector('[data-counter-text="number"]');
    const counterDecimal = document.querySelector('[data-counter-text="decimal"]');
    
    if (!section || circles.length === 0) {
        return;
    }

    // Get min and max values from data attributes
    const minValue = parseFloat(section.getAttribute('data-min')) || 0;
    const maxValue = parseFloat(section.getAttribute('data-max')) || 99.95;

    // All circles start at the same initial size
    const initialScale = 0.15; // Starting size for all circles
    
    // Calculate max scales - different final sizes but same growth rate
    const maxScales = circles.length > 0 ? 
        Array.from({length: circles.length}, (_, i) => 3 + (i * 0.5)) : [3, 3.5, 4];
    
    // Calculate scale per progress - ALL circles use the SAME value
    const triggerScale = 3.5; // Scale value that triggers next circle
    const numCircles = circles.length;
    
    // All circles must grow at the SAME scale per progress
    // Calculate based on compressing the timeline to fit all circles
    // For 3 circles: use tighter spacing - 0.23, 0.23, remaining (makes circles appear closer together)
    // This makes second and third appear much closer
    let circleStartProgress;
    if (numCircles === 3) {
        // First circle reaches 3.5 at 0.23, second at 0.46, third starts at 0.46
        circleStartProgress = [0, 0.23, 0.46];
    } else {
        const progressPerCircle = 1.0 / numCircles;
        circleStartProgress = Array.from({length: numCircles}, (_, i) => i * progressPerCircle);
    }
    
    // Calculate progress needed for each circle to reach 3.5 (for scalePerProgress calculation)
    let progressPerCircle;
    if (numCircles === 3) {
        progressPerCircle = 0.23; // Progress needed for each circle to reach 3.5
    } else {
        progressPerCircle = 1.0 / numCircles;
    }
    
    // FIXED: Same scalePerProgress for ALL circles (same growth rate)
    const scalePerProgress = (triggerScale - initialScale) / progressPerCircle;
    
    // Calculate when each circle should start (based on previous circle reaching 3.5 scale)
    // First circle starts at progress 0
    // Second circle starts when first reaches scale 3.5
    // Third circle starts when second reaches scale 3.5
    circles.forEach((circle, index) => {
        const maxScale = maxScales[index] || 3; // Different max scales for each circle
        
        // Calculate when this circle should start growing
        // Each circle starts when previous reaches scale 3.5
        const startProgress = circleStartProgress[index];
        
        // Set initial state - all start at same size, invisible until their time
        circle.style.transform = `scale(${initialScale})`;
        circle.style.opacity = '0'; // All start invisible
        
        // Use ScrollTrigger to animate
        ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            scrub: true,
            onUpdate: (self) => {
                const progress = self.progress;
                
                // All circles grow at the SAME scale per progress (FIXED value)
                // All circles start at initialScale when they appear, then grow at same rate
                let scale = initialScale;
                if (progress >= startProgress) {
                    // Calculate scale: start from initialScale, grow by same amount per progress
                    // ALL circles use the SAME scalePerProgress value (same growth rate)
                    // Scale grows from the point where this circle started (progress - startProgress)
                    const growthProgress = progress - startProgress;
                    scale = initialScale + (growthProgress * scalePerProgress);
                }
                
                // Opacity: based on scale - small circles are transparent, big circles are opaque
                // Only show circle if it has appeared (progress >= startProgress)
                let opacity = 0;
                if (progress >= startProgress && scale >= initialScale) {
                    // Calculate opacity based on current scale
                    // Use a reference max scale for opacity normalization (to avoid division by 0)
                    const referenceMaxScale = maxScales[0] || 3;
                    const scaleNormalized = Math.min(1, (scale - initialScale) / (referenceMaxScale - initialScale));
                    // Map normalized scale to opacity: 0.1 (min) to 0.6 (max)
                    opacity = 0.1 + (scaleNormalized * 0.5); // 0.1 when small, 0.6 when big
                    
                    // Also fade out at the very end (last 10%)
                    if (progress > 0.9) {
                        const fadeOutProgress = (1 - progress) / 0.1;
                        opacity *= fadeOutProgress; // Fade out in last 10%
                    }
                }
                
                // Scale only - no translate (centering is handled by CSS with margin)
                circle.style.transform = `scale(${scale})`;
                circle.style.opacity = opacity;
            }
        });
    });

    // Animate counter if present
    if (counterNumber && counterDecimal) {
        let counterObj = { value: minValue };
        
        gsap.to(counterObj, {
            value: maxValue,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top center',
                end: 'bottom center',
                scrub: true,
                onUpdate: (self) => {
                    // Format the counter value
                    const currentValue = minValue + (maxValue - minValue) * self.progress;
                    const parts = currentValue.toFixed(2).split('.');
                    counterNumber.textContent = parts[0];
                    counterDecimal.textContent = parts[1] + '%';
                }
            }
        });
    }
}

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }, 250);
});

