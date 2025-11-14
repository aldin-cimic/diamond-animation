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

    // Animate counter if present with inertia effect
    if (counterNumber && counterDecimal) {
        let counterObj = { value: minValue };
        let lastProgress = 0;
        let lastTime = Date.now();
        let velocity = 0;
        let inertiaTween = null;
        let scrollStopTimer = null;
        
        // Create the main scroll animation
        gsap.to(counterObj, {
            value: maxValue,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top center',
                end: 'bottom center',
                scrub: 1, // Add slight smoothing
                onUpdate: (self) => {
                    const currentTime = Date.now();
                    const timeDelta = currentTime - lastTime;
                    
                    if (timeDelta > 0) {
                        // Calculate scroll velocity
                        const progressDelta = self.progress - lastProgress;
                        velocity = progressDelta / (timeDelta / 1000); // Progress per second
                        
                        // Update target value
                        const targetValue = minValue + (maxValue - minValue) * self.progress;
                        
                        // Kill any existing inertia animation
                        if (inertiaTween) {
                            inertiaTween.kill();
                            inertiaTween = null;
                        }
                        
                        // Clear scroll stop timer
                        if (scrollStopTimer) {
                            clearTimeout(scrollStopTimer);
                            scrollStopTimer = null;
                        }
                        
                        // Update counter smoothly
                        gsap.to(counterObj, {
                            value: targetValue,
                            duration: 0.3,
                            ease: 'power2.out',
                            onUpdate: () => {
                                const parts = counterObj.value.toFixed(2).split('.');
                                counterNumber.textContent = parts[0];
                                counterDecimal.textContent = parts[1] + '%';
                            }
                        });
                        
                        lastProgress = self.progress;
                        lastTime = currentTime;
                        
                        // Set timer to detect scroll stop and apply inertia
                        scrollStopTimer = setTimeout(() => {
                            applyInertia();
                        }, 150); // Wait 150ms after last scroll update
                    }
                }
            }
        });
        
        // Function to apply inertia effect when scroll stops
        function applyInertia() {
            if (inertiaTween) {
                inertiaTween.kill();
            }
            
            if (Math.abs(velocity) > 0.01) {
                // Calculate inertia distance (continues a bit based on velocity)
                const inertiaDistance = velocity * 0.15; // Adjust multiplier for inertia strength
                const currentProgress = (counterObj.value - minValue) / (maxValue - minValue);
                const targetProgress = Math.max(0, Math.min(1, currentProgress + inertiaDistance));
                const targetValue = minValue + (maxValue - minValue) * targetProgress;
                
                // Animate to final position with ease-out for inertia feel
                inertiaTween = gsap.to(counterObj, {
                    value: targetValue,
                    duration: 0.6,
                    ease: 'power3.out',
                    onUpdate: () => {
                        const parts = counterObj.value.toFixed(2).split('.');
                        counterNumber.textContent = parts[0];
                        counterDecimal.textContent = parts[1] + '%';
                    },
                    onComplete: () => {
                        velocity = 0; // Reset velocity after inertia completes
                        inertiaTween = null;
                    }
                });
            }
        }
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

