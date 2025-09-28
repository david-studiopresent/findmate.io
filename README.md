# FindMate - Pre-Launch Landing Page

A sleek, high-conversion landing page for the FindMate Kickstarter campaign at FindMate.io.

## Features

✅ **Modern Design**: Apple-like aesthetic with clean typography and ample white space
✅ **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
✅ **High Performance**: Fast loading, optimized CSS and JavaScript
✅ **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
✅ **Form Integration**: Direct submission to Google Sheets with UTM tracking
✅ **Micro-Interactions**: Smooth animations and hover effects
✅ **SEO Optimized**: Proper meta tags and semantic HTML structure

## Sections

1. **Hero**: Compelling headline with primary CTA
2. **How It Works**: 3-step process explanation
3. **Use Cases**: Target audience cards (photographers, contractors, travelers, students, outdoor enthusiasts)
4. **Benefits**: 6-item grid highlighting key advantages
5. **Video Teaser**: Demo video with Kickstarter announcement
6. **Social Proof**: Early supporter pricing and press mentions
7. **Email Capture**: Waitlist signup form with Google Sheets integration
8. **FAQ**: 6 common questions with expandable answers
9. **Footer**: Legal links and disclaimers

## Tech Stack

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript**: No frameworks, optimized for performance
- **Google Sheets API**: Form submission via Google Apps Script

## Setup

1. **Clone/Download** the files to your web server
2. **Add Images**: Place required images in `/images/` directory (see ASSETS_REQUIRED.md)
3. **Add Video**: Place demo video as `/videos/smart-gadget-tracker-demo.mp4`
4. **Configure Analytics**: Add Google Analytics, Facebook Pixel, or other tracking codes

## Form Integration

The waitlist form submits to Google Apps Script URL:
`https://script.google.com/macros/s/AKfycbzjasRC4CTD8rmJ8eOg81pHe1dXE4eb3KbttLA5mWbsFQ_dN1VYH_qLFn-osuhhLVeV/exec`

### Data Captured:
- Name and email (required)
- Timestamp
- UTM parameters
- Referrer information
- User agent
- Page URL

## Browser Support

- **Modern browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Mobile**: iOS Safari 14+, Chrome Mobile 88+
- **Accessibility**: Screen readers, keyboard navigation
- **Performance**: < 3s load time on 3G

## File Structure

```
FindMate/
├── index.html          # Main landing page
├── styles.css          # Complete CSS styling
├── script.js           # JavaScript functionality
├── images/             # Image assets (see ASSETS_REQUIRED.md)
├── videos/             # Video assets
├── ASSETS_REQUIRED.md  # Asset specifications
└── README.md           # This file
```

## Performance Optimizations

- **CSS**: Efficient selectors, minimal reflows
- **JavaScript**: Event delegation, debounced scroll handlers
- **Images**: Proper sizing, lazy loading considerations
- **Fonts**: Preloaded Google Fonts with font-display: swap
- **Critical Path**: Inlined critical CSS for fast first paint

## Analytics Integration

Ready for integration with:
- Google Analytics 4
- Facebook Pixel
- Custom event tracking
- UTM parameter capture
- Conversion tracking

## Testing

1. **Local Server**: `python3 -m http.server 8000`
2. **Responsive**: Test on multiple device sizes
3. **Accessibility**: Use screen reader, keyboard-only navigation
4. **Performance**: Check loading speed and Core Web Vitals
5. **Form**: Submit test data to verify Google Sheets integration

## Deployment

1. Upload files to web hosting
2. Ensure HTTPS is enabled
3. Configure proper MIME types
4. Set up CDN for images/videos (optional)
5. Add analytics tracking codes
6. Test form submission in production

## Customization

### Colors
Modify CSS custom properties in `:root` for brand colors:
```css
--cool-accent: #2563eb;        /* Primary blue */
--primary-dark: #1a1a1a;       /* Main text */
--light-gray: #f8f9fa;         /* Background */
```

### Content
Edit text directly in `index.html` - all content is semantic and easily modifiable.

### Tracking
Update Google Apps Script URL in `script.js` for form submissions.

## License

Production-ready code for Smart Gadget Tracker Kickstarter campaign.