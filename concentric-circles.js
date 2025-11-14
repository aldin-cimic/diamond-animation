/**
 * Concentric Circles Animation
 * Creates concentric circles that scale from center as user scrolls
 */

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    initConcentricCircles();
});

function initConcentricCircles() {
    const section = document.querySelector('[data-counter-block]');
    const circles = document.querySelectorAll('[data-circle]');
    const counterNumber = document.querySelector('[data-counter-text="number"]');
    const counterDecimal = document.querySelector('[data-counter-text="decimal"]');
    
    if (!section || circles.length === 0) {
        console.warn('Concentric circles elements not found');
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
    
    // Calculate scale per progress to fit all circles within 0-1 progress range
    // We need to divide the progress range among all circles
    const triggerScale = 3.5; // Scale value that triggers next circle
    const numCircles = circles.length;
    // Each circle needs progress to reach 3.5, so divide 1.0 by numCircles
    // This ensures all circles fit within the scroll range
    const progressPerCircle = 1.0 / numCircles; // Equal progress for each circle
    const scalePerProgress = (triggerScale - initialScale) / progressPerCircle; // Scale growth per progress unit
    
    // Calculate when each circle should start (based on previous circle reaching 3.5 scale)
    // First circle starts at progress 0
    // Second circle starts when first reaches scale 3.5
    // Third circle starts when second reaches scale 3.5
    // Progress needed for each circle to reach 3.5
    const progressWhenReaches35 = progressPerCircle; // Same for all circles now
    
    // Animate each circle with staggered appearance based on previous circle's scale
    circles.forEach((circle, index) => {
        const maxScale = maxScales[index] || 3; // Different max scales for each circle
        
        // Calculate when this circle should start growing
        // Each circle starts when previous reaches scale 3.5
        const startProgress = index * progressWhenReaches35; // 0, progressPerCircle, 2*progressPerCircle, etc.
        
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
                    // ALL circles use the SAME scalePerProgress value
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

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });
}

