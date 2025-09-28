# FindMate Analytics Setup Guide

## 🎯 Google Analytics 4 Setup

### 1. Create Google Analytics Account
1. Go to https://analytics.google.com
2. Create new account: "FindMate"
3. Create new property: "FindMate.io"
4. Select industry: "Technology"
5. Business size: "Small"

### 2. Get Measurement ID
1. In GA4, go to Admin > Data Streams
2. Click "Add stream" > "Web"
3. Enter URL: https://findmate.io
4. Stream name: "FindMate Website"
5. Copy the **Measurement ID** (looks like: G-XXXXXXXXXX)

### 3. Update Code
Replace `GA_MEASUREMENT_ID` in `index.html` with your actual ID:

```html
<!-- Line 88 and 93 in index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  gtag('config', 'G-XXXXXXXXXX', {
```

## 📊 Google Tag Manager Setup (Optional)

### 1. Create GTM Account
1. Go to https://tagmanager.google.com
2. Create account: "FindMate"
3. Container name: "FindMate.io"
4. Target platform: "Web"

### 2. Get Container ID
Copy the **Container ID** (looks like: GTM-XXXXXXX)

### 3. Update Code
Replace `GTM-XXXXXXX` in `index.html` lines 104 and 108 with your actual ID.

## 🎯 Tracking Events Setup

The landing page tracks these events automatically:

### Custom Events Tracked:
- **waitlist_signup** - When someone joins the waitlist
- **section_view** - When user scrolls to different sections
- **cta_click** - When CTA buttons are clicked
- **page_view** - Initial page load

### Custom Parameters:
- `custom_parameter_1`: Always "landing_page"
- `user_email`: Email from form submissions
- `user_name`: Name from form submissions
- `source`: Traffic source information

## 📈 Recommended GA4 Configuration

### 1. Enhanced Ecommerce
Enable in GA4 Admin > Data Settings > Enhanced Ecommerce

### 2. Conversions
Mark these events as conversions:
- `waitlist_signup` (Primary conversion)
- `cta_click` (Secondary conversion)

### 3. Audiences
Create these audiences:
- **Engaged Users**: Users who viewed 3+ sections
- **High Intent**: Users who clicked CTA but didn't convert
- **Converters**: Users who completed waitlist signup

### 4. Custom Dimensions
Add these for better tracking:
- **Source Type** (dimension1): Landing page type
- **User Email** (dimension2): Email from forms
- **Campaign Source** (dimension3): UTM source

## 🔍 Facebook Pixel Setup (Optional)

### 1. Create Facebook Pixel
1. Go to Facebook Business Manager
2. Events Manager > Data Sources > Pixels
3. Create new pixel: "FindMate Pixel"

### 2. Add Pixel Code
Add this to `index.html` after Google Analytics:

```html
<!-- Facebook Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"
/></noscript>
```

### 3. Update Script.js
The form already includes Facebook Pixel tracking in the `trackConversion` function.

## 📊 Analytics Dashboard Setup

### Key Metrics to Monitor:
1. **Conversion Rate**: Waitlist signups / Total visitors
2. **Traffic Sources**: Organic, social, direct, referral
3. **Page Engagement**: Time on page, scroll depth
4. **Form Funnel**: Form views → Form starts → Form completions
5. **Section Performance**: Which sections get most engagement

### Google Analytics Reports to Set Up:
1. **Conversion Funnel**: Page view → Section views → CTA clicks → Signup
2. **Traffic Source Performance**: Which sources convert best
3. **Device/Browser Analysis**: Mobile vs desktop performance
4. **Geographic Analysis**: Where visitors come from

## 🎯 Kickstarter Campaign Tracking

### UTM Parameters for Campaign:
```
?utm_source=kickstarter
&utm_medium=campaign
&utm_campaign=findmate_launch
&utm_term=rfid_tracker
&utm_content=main_page
```

### Track These Campaign Events:
- Kickstarter referrals
- Email campaign performance
- Social media traffic
- Press coverage traffic

## 🔧 Testing Your Setup

### 1. Real-time Testing
1. Open GA4 Real-time reports
2. Visit your site in incognito mode
3. Interact with page (scroll, click buttons, submit form)
4. Verify events appear in real-time

### 2. Google Analytics Debugger
1. Install "Google Analytics Debugger" Chrome extension
2. Enable debugging
3. Check browser console for GA events

### 3. Tag Assistant
1. Install "Tag Assistant Legacy" Chrome extension
2. Record session on your site
3. Verify all tags fire correctly

## 📝 Privacy Compliance

### GDPR/CCPA Considerations:
1. Add cookie consent banner (if required)
2. Update privacy policy to mention analytics
3. Provide opt-out mechanism if needed
4. Consider IP anonymization:

```javascript
gtag('config', 'G-XXXXXXXXXX', {
  'anonymize_ip': true
});
```

## ⚠️ Important Notes

1. **Replace Placeholder IDs**: All `GA_MEASUREMENT_ID` and `GTM-XXXXXXX` must be replaced
2. **Test Before Launch**: Always test analytics in staging environment
3. **Data Retention**: Set appropriate data retention policies in GA4
4. **Goals Setup**: Configure conversion goals immediately after launch
5. **Regular Monitoring**: Check analytics weekly during campaign

---

Your FindMate landing page is now ready for comprehensive analytics tracking! 📊🚀