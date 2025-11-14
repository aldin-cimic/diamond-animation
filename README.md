# Star Mask Animation Package

A complete animation package featuring two scroll-triggered effects:
1. **Diamond Reveal Effect** - Reveals a background image through a diamond-shaped mask as you scroll
2. **Concentric Circles Effect** - Creates concentric circles that scale from the center with a counter

Perfect for implementing in Elementor or any WordPress site.

---

## 📁 File Structure

```
star-mask/
├── diamond-reveal.html          # Standalone diamond reveal demo
├── concentric-circles.html      # Standalone circles demo
├── combined.html                 # Combined both effects demo
├── styles.css                    # Main CSS file
├── diamond-reveal.js            # Diamond reveal JavaScript
├── concentric-circles.js        # Concentric circles JavaScript
├── diamond-mask.svg             # SVG diamond mask
├── elementor-diamond-reveal.html # Elementor implementation (diamond)
├── elementor-concentric-circles.html # Elementor implementation (circles)
└── README.md                    # This file
```

---

## 🎯 Quick Start for Elementor

### Option A: Using HTML Widget (Recommended)

#### For Diamond Reveal Effect:

1. **Add an HTML Widget** in Elementor
2. **Copy the content** from `elementor-diamond-reveal.html`
3. **Replace** `YOUR_IMAGE_URL_HERE` with your actual image URL
4. **Add GSAP Scripts** (if not already added):
   - Go to Elementor > Settings > Advanced > Custom Code > Footer
   - Or add via a Code widget at the bottom of your page
   - Add these scripts:
     ```html
     <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
     <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
     ```

#### For Concentric Circles Effect:

1. **Add an HTML Widget** in Elementor
2. **Copy the content** from `elementor-concentric-circles.html`
3. **Customize** the text and counter values as needed
4. **Add GSAP Scripts** (same as above)

### Option B: Separate HTML, CSS, and JS

1. **Upload files** to your WordPress theme or child theme:
   - `diamond-mask.svg` → upload to `/wp-content/uploads/` or your theme folder
   - Update the SVG path in CSS if needed

2. **Add HTML** via Elementor HTML widget:
   - Copy HTML structure from `elementor-diamond-reveal.html` or `elementor-concentric-circles.html`

3. **Add CSS** via Elementor:
   - Settings > Advanced > Custom CSS
   - Or Page Settings > Advanced > Custom CSS
   - Copy relevant CSS from `styles.css`

4. **Add JavaScript**:
   - Elementor > Settings > Advanced > Custom Code > Footer
   - Copy from `diamond-reveal.js` or `concentric-circles.js`
   - Make sure GSAP is loaded first

---

## 📖 Detailed Implementation Guide

### Diamond Reveal Effect

#### HTML Structure:
```html
<section class="diamond-reveal-section" data-animation="star-mask">
    <div class="reveal-content-layer">
        <div class="content-wrapper">
            <h2>Your Title</h2>
            <p>Your content here</p>
        </div>
    </div>
    <div class="reveal-image-layer" data-mask-block>
        <div class="background-image-container">
            <img src="your-image.jpg" alt="Background">
        </div>
    </div>
    <div class="reveal-spacer"></div>
</section>
```

#### Customization:

**Change Background Color:**
```css
.reveal-content-layer {
    background-color: #YOUR_COLOR;
}
```

**Change Text Color:**
```css
.reveal-content-layer {
    color: #YOUR_COLOR;
}
```

**Adjust Reveal Speed:**
In `diamond-reveal.js`, change the `end: '+=200%'` value:
- Higher value = slower reveal (more scroll needed)
- Lower value = faster reveal (less scroll needed)

**Change Image:**
Replace the `src` attribute in the `<img>` tag with your image URL.

---

### Concentric Circles Effect

#### HTML Structure:
```html
<section class="circles-section" data-counter-block data-min="0" data-max="99.95">
    <div class="circles-container">
        <span class="circle" data-circle="0"></span>
        <span class="circle" data-circle="1"></span>
        <span class="circle" data-circle="2"></span>
    </div>
    <div class="circles-content">
        <p class="circles-subtitle">Your subtitle</p>
        <div class="circles-counter">
            <span data-counter-text="number">0</span>
            <span>.</span>
            <span data-counter-text="decimal">00%</span>
        </div>
        <p class="circles-description">Your description</p>
    </div>
    <div class="circles-spacer"></div>
</section>
```

#### Customization:

**Change Background Color:**
```css
.circles-section {
    background-color: #YOUR_COLOR;
}
```

**Change Circle Color:**
```css
.circle {
    border-color: #YOUR_COLOR;
}
```

**Change Counter Range:**
Modify the `data-min` and `data-max` attributes:
```html
data-min="0" data-max="99.95"
```

**Add/Remove Circles:**
- Add more `<span class="circle" data-circle="3"></span>` elements
- Update CSS sizes for each circle
- The JavaScript will automatically detect them

**Adjust Circle Sizes:**
```css
.circle[data-circle="0"] {
    width: 200px;
    height: 200px;
}
/* Increase for larger circles */
```

---

## 🎨 Styling Tips

### Responsive Adjustments

**Mobile (< 768px):**
- Default styles work well
- Circles are 200px, 400px, 600px

**Tablet (≥ 768px):**
- Circles scale to 300px, 600px, 900px
- Font sizes increase

**Desktop (≥ 1024px):**
- Further font size increases
- Consider adjusting circle sizes if needed

### Color Schemes

**Light Theme:**
```css
.reveal-content-layer {
    background-color: #f5f1e8;
    color: #1a1a1a;
}
```

**Dark Theme:**
```css
.reveal-content-layer {
    background-color: #1a1a1a;
    color: #f5f1e8;
}
```

---

## 🔧 Advanced Customization

### Custom Diamond Shape

To create a custom mask shape:

1. **Create your SVG** (e.g., star, hexagon, etc.)
2. **Base64 encode it** or save as a file
3. **Update CSS:**
```css
.reveal-image-layer {
    mask-image: url('path-to-your-mask.svg');
    -webkit-mask-image: url('path-to-your-mask.svg');
}
```

### Custom Animation Timing

**Diamond Reveal:**
```javascript
scrollTrigger: {
    trigger: section,
    start: 'top top',        // When animation starts
    end: '+=200%',           // Scroll distance (200% of viewport)
    scrub: true,             // Smooth scrubbing
}
```

**Circles:**
```javascript
scrollTrigger: {
    trigger: section,
    start: 'top center',     // When animation starts
    end: 'bottom center',    // When animation ends
    scrub: true,
}
```

### Multiple Instances

To use multiple instances on the same page:

1. **Add unique IDs** to each section
2. **Update JavaScript** to target specific sections:
```javascript
const section = document.querySelector('#unique-id[data-animation="star-mask"]');
```

---

## 🐛 Troubleshooting

### Animation Not Working

1. **Check GSAP is loaded:**
   ```javascript
   console.log(typeof gsap); // Should output "object"
   console.log(typeof ScrollTrigger); // Should output "object"
   ```

2. **Check browser console** for errors

3. **Verify HTML structure** matches the required data attributes

4. **Check z-index conflicts** - Elements might be behind other content

### Mask Not Showing

1. **Verify SVG path** is correct
2. **Check browser support** - CSS masks need modern browser
3. **Try inline SVG** (base64 encoded) instead of external file

### Circles Not Scaling

1. **Check ScrollTrigger** is initialized
2. **Verify section height** - needs enough scroll space
3. **Check console** for JavaScript errors

### Counter Not Animating

1. **Verify data attributes** are present: `data-counter-text="number"` and `data-counter-text="decimal"`
2. **Check counter JavaScript** is loaded
3. **Verify section has** `data-counter-block` attribute

---

## 📱 Browser Support

- **Modern browsers:** Chrome, Firefox, Safari, Edge (latest versions)
- **CSS Masks:** Requires browser with mask-image support
- **GSAP ScrollTrigger:** Works in all modern browsers

### Fallback for Older Browsers

For browsers without mask support, you can use `clip-path` as a fallback:
```css
.reveal-image-layer {
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}
```

---

## 📦 Dependencies

- **GSAP 3.12.5+** - Animation library
- **ScrollTrigger Plugin** - Scroll-triggered animations

Both are loaded via CDN in the provided HTML files.

---

## 📝 License

Free to use for personal and commercial projects.

---

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all files are correctly implemented
3. Check browser console for errors

---

## ✨ Credits

Inspired by the animation effects on [ayocin.com](https://ayocin.com/).

---

## 🎯 Quick Reference

### Data Attributes

**Diamond Reveal:**
- `data-animation="star-mask"` - Main section identifier
- `data-mask-block` - Mask container identifier

**Concentric Circles:**
- `data-counter-block` - Main section identifier
- `data-min="0"` - Counter minimum value
- `data-max="99.95"` - Counter maximum value
- `data-circle="0"` - Circle identifier (0, 1, 2, etc.)
- `data-counter-text="number"` - Counter whole number
- `data-counter-text="decimal"` - Counter decimal part

---

**Happy animating! 🎉**

