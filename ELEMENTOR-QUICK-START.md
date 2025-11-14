# Elementor Quick Start Guide

This guide will help you implement the Star Mask animations in Elementor quickly.

---

## 🚀 Method 1: All-in-One HTML Widget (Easiest)

### Step 1: Add GSAP Scripts (One Time Setup)

1. Go to **Elementor > Settings > Advanced**
2. Scroll to **Custom Code** section
3. In the **Footer** field, add:

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
```

4. Click **Save Changes**

> **Note:** You only need to do this once per site. These scripts will load on all pages.

---

### Step 2: Add Diamond Reveal Effect

1. **Drag an HTML widget** onto your Elementor page
2. **Open** `elementor-diamond-reveal.html` file
3. **Copy ALL the content** (HTML, CSS, and JavaScript)
4. **Paste into the HTML widget**
5. **Replace** `YOUR_IMAGE_URL_HERE` with your actual image URL:
   ```html
   <img src="https://your-site.com/wp-content/uploads/your-image.jpg" alt="Background Image">
   ```
6. **Customize the text** in the content layer:
   ```html
   <h2 class="reveal-title">Your Title Here</h2>
   <p>Your description here</p>
   ```
7. **Publish/Update** your page

**Done!** The diamond reveal effect should now work.

---

### Step 3: Add Concentric Circles Effect (Optional)

1. **Drag another HTML widget** onto your page (below or above the diamond reveal)
2. **Open** `elementor-concentric-circles.html` file
3. **Copy ALL the content** (HTML, CSS, and JavaScript)
4. **Paste into the HTML widget**
5. **Customize the content:**
   - Change subtitle: `With the use of a HEPA filter`
   - Change description: `of air pollutants are removed...`
   - Adjust counter range: `data-min="0" data-max="99.95"`
6. **Publish/Update** your page

**Done!** The circles effect should now work.

---

## 🎨 Method 2: Separate CSS and JS (More Control)

### Step 1: Add GSAP Scripts
Same as Method 1, Step 1.

### Step 2: Add CSS to Elementor

1. Go to **Elementor > Settings > Advanced > Custom CSS**
   OR
   **Page Settings > Advanced > Custom CSS** (for page-specific styles)

2. **Copy the CSS** from `styles.css` for the effect you want:
   - For Diamond Reveal: Copy the `.diamond-reveal-section` and related styles
   - For Circles: Copy the `.circles-section` and related styles

3. **Paste and Save**

### Step 3: Add HTML Structure

1. **Drag an HTML widget** onto your page
2. **Copy only the HTML** (without `<style>` or `<script>` tags) from:
   - `elementor-diamond-reveal.html` (for diamond reveal)
   - `elementor-concentric-circles.html` (for circles)

3. **Paste into the HTML widget**
4. **Update image URL and text** as needed

### Step 4: Add JavaScript

1. Go to **Elementor > Settings > Advanced > Custom Code > Footer**
   OR
   Add a **Code widget** at the bottom of your page

2. **Copy the JavaScript** from:
   - `diamond-reveal.js` (for diamond reveal)
   - `concentric-circles.js` (for circles)
   OR
   - `combined-animations.js` (for both)

3. **Wrap it in script tags** if using Code widget:
   ```html
   <script>
   // Paste JavaScript here
   </script>
   ```

4. **Save**

---

## 🎯 Common Customizations

### Change Colors

**Diamond Reveal Background:**
Find this in your CSS:
```css
.reveal-content-layer {
    background-color: #f5f1e8; /* Change this */
}
```

**Circle Background:**
```css
.circles-section {
    background-color: #1a1a1a; /* Change this */
}
```

**Circle Border:**
```css
.circle {
    border-color: #f5f1e8; /* Change this */
}
```

### Change Animation Speed

**Diamond Reveal (slower = more scroll needed):**
In the JavaScript, find:
```javascript
end: '+=200%'  // Change to '+=300%' for slower
```

**Circles:**
In the JavaScript, find:
```javascript
start: 'top center',    // Change to 'top top' for earlier start
end: 'bottom center',   // Change to 'bottom top' for earlier end
```

### Change Counter Values

In the HTML, find:
```html
data-min="0" data-max="99.95"
```

Change to your desired range:
```html
data-min="50" data-max="100"
```

---

## 📝 Elementor Widget Settings

### Recommended Settings for HTML Widget:

1. **Layout:**
   - Width: Full Width (or Boxed if preferred)

2. **Advanced Tab:**
   - **Z-index:** Leave default (or adjust if needed)
   - **CSS Classes:** You can add custom classes here
   - **Custom CSS:** You can add page-specific overrides here

3. **Responsive:**
   - The included CSS handles responsive design automatically
   - You can add custom responsive styles if needed

---

## ⚠️ Troubleshooting

### Animation Not Working

1. **Check GSAP is loaded:**
   - Open browser console (F12)
   - Type: `console.log(typeof gsap)`
   - Should output: `"object"`
   - If not, scripts aren't loading - check Step 1

2. **Check HTML structure:**
   - Make sure data attributes are present:
     - For Diamond: `data-animation="star-mask"` and `data-mask-block`
     - For Circles: `data-counter-block` and `data-circle` attributes

3. **Check for JavaScript errors:**
   - Open browser console (F12)
   - Look for red error messages
   - Common issues: GSAP not loaded, missing elements

### Mask Not Showing (Diamond Reveal)

1. **Try using base64 SVG** (already included in elementor files)
2. **Check image URL** is correct and accessible
3. **Check browser** - CSS masks require modern browser

### Styles Not Applied

1. **Check CSS is added** to Elementor Custom CSS
2. **Clear cache** if using caching plugins
3. **Check for CSS conflicts** - try adding `!important` to test

---

## 🎨 Tips for Best Results

1. **Image Optimization:**
   - Use high-quality images (1920px width recommended)
   - Optimize file size for web
   - Use WebP format if possible

2. **Section Height:**
   - Ensure enough content/space above and below animations
   - Users need to scroll to trigger animations

3. **Mobile Testing:**
   - Always test on mobile devices
   - Animations are responsive but may need tweaks

4. **Performance:**
   - Don't use too many instances on one page
   - Optimize images before uploading

---

## 📱 Testing Checklist

- [ ] GSAP scripts are loading
- [ ] HTML structure is correct
- [ ] CSS is applied
- [ ] JavaScript is working (check console)
- [ ] Animation triggers on scroll
- [ ] Works on desktop
- [ ] Works on mobile
- [ ] Images load correctly
- [ ] Colors match your design

---

## 🆘 Still Having Issues?

1. **Check the full README.md** for detailed documentation
2. **Review browser console** for specific errors
3. **Test with standalone HTML files** first (diamond-reveal.html, concentric-circles.html)
4. **Check Elementor version** - works with Elementor 2.0+

---

**Need help? Review the main README.md for advanced customization options.**

