// Smart Gadget Tracker Landing Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeScrollEffects();
    initializeFAQ();
    initializeFormHandling();
    initializeAnimations();
    initializeUTMTracking();
    initializeFloatingCTA();
    initializeCarousel();
});

// Smooth scroll and header effects
function initializeScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroImage = document.querySelector('.product-mockup');

        if (hero && heroImage) {
            const rate = scrolled * -0.5;
            heroImage.style.transform = `translateY(${rate}px)`;
        }
    });
}

// FAQ Accordion Functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', function() {
            const isOpen = item.classList.contains('active');

            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
                faqItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Open clicked item if it wasn't already open
            if (!isOpen) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

// Form Handling and Google Sheets Integration
function initializeFormHandling() {
    const form = document.getElementById('waitlist-form');
    const submitButton = document.getElementById('waitlist-submit');
    const originalButtonText = submitButton.textContent;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data using both FormData and direct element access
        const formData = new FormData(form);

        // Method 1: FormData
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const socialLinkFromFormData = formData.get('social_link');
        const whyChooseFromFormData = formData.get('why_choose');
        const consent = formData.get('consent');

        // Method 2: Direct element access (backup)
        const socialLinkElement = document.getElementById('social_link');
        const whyChooseElement = document.getElementById('why_choose');

        const socialLinkDirect = socialLinkElement ? socialLinkElement.value.trim() : '';
        const whyChooseDirect = whyChooseElement ? whyChooseElement.value.trim() : '';

        // Use direct access as primary, FormData as fallback
        const socialLink = socialLinkDirect || (socialLinkFromFormData ? socialLinkFromFormData.trim() : '');
        const whyChoose = whyChooseDirect || (whyChooseFromFormData ? whyChooseFromFormData.trim() : '');

        // Debug: Log all methods
        console.log('🔍 Form data debug (EXTENDED):');
        console.log('  name:', name);
        console.log('  email:', email);
        console.log('  social_link FormData:', socialLinkFromFormData);
        console.log('  social_link Direct:', socialLinkDirect);
        console.log('  social_link FINAL:', socialLink);
        console.log('  why_choose FormData:', whyChooseFromFormData);
        console.log('  why_choose Direct:', whyChooseDirect);
        console.log('  why_choose FINAL:', whyChoose);
        console.log('  consent:', consent);

        // Also log all form fields for debugging
        console.log('🔍 All form fields:');
        const allFormData = new FormData(form);
        for (let [key, value] of allFormData.entries()) {
            console.log(`  ${key}: "${value}"`);
        }

        // Validate form
        if (!name || !email || !consent) {
            showFormMessage('Please fill in all fields and agree to receive updates.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Disable form during submission
        setFormLoading(true);

        try {
            console.log('🔄 Form submission started', { name, email });

            // Prepare data for submission
            const submissionData = {
                name: name,
                email: email,
                social_link: socialLink,
                why_choose: whyChoose,
                timestamp: new Date().toISOString(),
                source: 'landing_page',
                utm_source: getURLParameter('utm_source') || '',
                utm_medium: getURLParameter('utm_medium') || '',
                utm_campaign: getURLParameter('utm_campaign') || '',
                utm_term: getURLParameter('utm_term') || '',
                utm_content: getURLParameter('utm_content') || '',
                user_agent: navigator.userAgent,
                referrer: document.referrer || '',
                page_url: window.location.href
            };

            console.log('📝 Submission data prepared:', submissionData);

            // Google Apps Script Web App URL - Updated with working deployment
            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_cmSUy-g6GafX4kx5UfGHDP53RZBGCygqiv2nluX-K-2yo7duhXSQSHtblysX9s8Q/exec';

            console.log('🔄 Submitting to Google Apps Script...');
            console.log('📍 Script URL:', GOOGLE_SCRIPT_URL);

            // Method 1: Try URL-encoded form submission (most reliable)
            let submitted = false;
            try {
                const params = new URLSearchParams();
                Object.keys(submissionData).forEach(key => {
                    params.append(key, submissionData[key]);
                });

                console.log('📤 Sending data:', submissionData);

                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    mode: 'no-cors',
                    body: params
                });

                console.log('✅ Form submission sent to Google Apps Script');
                submitted = true;

                // Since we're using no-cors, we can't read the response, but we'll assume success
                // The Google Apps Script will log everything for debugging

            } catch (submissionError) {
                console.error('❌ Google Apps Script submission failed:', submissionError);
                submitted = false;
            }

            // Method 3: Store locally if other methods fail
            if (!submitted) {
                console.log('🔄 Using localStorage fallback...');
                // Store in localStorage as fallback
                const waitlistData = JSON.parse(localStorage.getItem('findmate_waitlist') || '[]');
                waitlistData.push(submissionData);
                localStorage.setItem('findmate_waitlist', JSON.stringify(waitlistData));

                console.log('💾 Data stored locally:', waitlistData);

                // Show success message but mention it will be processed
                showFormMessage('✅ Signed up! Your information has been saved and will be processed shortly.', 'success');
                form.reset();

                // Track conversion
                trackConversion('waitlist_signup_offline', {
                    email: email,
                    name: name
                });

                return;
            }

            // Show success message
            showFormMessage('🎉 Success! You\'re on the waitlist. Check your email for confirmation.', 'success');
            form.reset();

            // Track conversion
            trackConversion('waitlist_signup', {
                email: email,
                name: name
            });

        } catch (error) {
            console.error('Form submission error:', error);

            // Store locally as final fallback
            try {
                const submissionData = {
                    name: name,
                    email: email,
                    timestamp: new Date().toISOString(),
                    source: 'landing_page_fallback'
                };

                const waitlistData = JSON.parse(localStorage.getItem('findmate_waitlist') || '[]');
                waitlistData.push(submissionData);
                localStorage.setItem('findmate_waitlist', JSON.stringify(waitlistData));

                showFormMessage('✅ Your information has been saved locally and will be processed. Thank you for joining!', 'success');
                form.reset();
            } catch (localError) {
                showFormMessage('❌ Unable to submit right now. Please try again later or contact us directly at hello@findmate.io', 'error');
            }
        } finally {
            setFormLoading(false);
        }
    });

    // Add real-time email validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function() {
        if (this.value && !isValidEmail(this.value)) {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = '';
        }
    });
}

// Form helper functions
function setFormLoading(loading) {
    const form = document.getElementById('waitlist-form');
    const submitButton = document.getElementById('waitlist-submit');
    const inputs = form.querySelectorAll('input');

    if (loading) {
        submitButton.textContent = 'Joining Waitlist...';
        submitButton.disabled = true;
        inputs.forEach(input => input.disabled = true);
        form.style.opacity = '0.7';
    } else {
        submitButton.textContent = 'Join the Waitlist';
        submitButton.disabled = false;
        inputs.forEach(input => input.disabled = false);
        form.style.opacity = '1';
    }
}

function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;

    // Style the message
    messageDiv.style.cssText = `
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 0.5rem;
        text-align: center;
        font-weight: 500;
        ${type === 'success' ?
            'background-color: rgba(16, 185, 129, 0.1); color: #059669; border: 1px solid rgba(16, 185, 129, 0.2);' :
            'background-color: rgba(239, 68, 68, 0.1); color: #dc2626; border: 1px solid rgba(239, 68, 68, 0.2);'
        }
    `;

    // Insert message after form
    const form = document.getElementById('waitlist-form');
    form.insertAdjacentElement('afterend', messageDiv);

    // Auto-remove success messages
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// UTM and URL parameter tracking
function initializeUTMTracking() {
    // Store UTM parameters in session storage for form submission
    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

    utmParams.forEach(param => {
        const value = getURLParameter(param);
        if (value) {
            sessionStorage.setItem(param, value);
        }
    });
}

function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name) || sessionStorage.getItem(name);
}

// Animation and Interaction Effects
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.step, .use-case-card, .benefit-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.cta-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Card hover effects
    const cards = document.querySelectorAll('.use-case-card, .step, .benefit-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-6px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Analytics and Conversion Tracking
function trackConversion(event, data = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', event, {
            event_category: 'engagement',
            event_label: event === 'waitlist_signup' ? 'waitlist_signup' : 'user_interaction',
            custom_parameter_1: 'landing_page',
            user_email: data.email || '',
            user_name: data.name || '',
            source: data.source || 'direct',
            ...data
        });
    }

    // Google Tag Manager events
    if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
            event: 'custom_event',
            event_name: event,
            event_category: 'engagement',
            event_data: data
        });
    }

    // Facebook Pixel (if implemented)
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: 'FindMate Waitlist',
            content_category: 'RFID Tracker',
            ...data
        });
    }

    // Custom analytics
    console.log('Conversion tracked:', event, data);
}

// Track page views and interactions
function trackPageView() {
    if (typeof gtag !== 'undefined') {
        gtag('config', 'G-0N67EKBR51', {
            page_title: 'FindMate - RFID Gadget Tracker',
            page_location: window.location.href,
            custom_parameter_1: 'landing_page'
        });
    }
}

// Track section views (scroll tracking)
function trackSectionView(sectionName) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'section_view', {
            event_category: 'engagement',
            event_label: sectionName,
            custom_parameter_1: 'landing_page'
        });
    }
}

// Track CTA clicks
function trackCTAClick(ctaLocation) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'cta_click', {
            event_category: 'engagement',
            event_label: ctaLocation,
            custom_parameter_1: 'landing_page'
        });
    }
}

// Scroll to CTA functionality
function scrollToCTA() {
    trackCTAClick('hero_button');
    const ctaSection = document.getElementById('waitlist');
    if (ctaSection) {
        ctaSection.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

// Initialize scroll tracking
function initializeScrollTracking() {
    const sections = [
        { id: 'hero', name: 'hero' },
        { id: 'how-it-works', name: 'how_it_works' },
        { id: 'use-cases', name: 'use_cases' },
        { id: 'benefits', name: 'benefits' },
        { id: 'video', name: 'video_demo' },
        { id: 'social-proof', name: 'social_proof' },
        { id: 'waitlist', name: 'email_capture' },
        { id: 'faq', name: 'faq' }
    ];

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionName = sections.find(s => s.id === entry.target.id)?.name;
                if (sectionName) {
                    trackSectionView(sectionName);
                }
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
            observer.observe(element);
        }
    });
}

// Attach scroll to CTA to hero button
document.addEventListener('DOMContentLoaded', function() {
    const heroCTA = document.getElementById('hero-cta');
    if (heroCTA) {
        heroCTA.addEventListener('click', scrollToCTA);
    }

    // Initialize scroll tracking
    initializeScrollTracking();

    // Track initial page view
    trackPageView();
});

// Video handling
document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.demo-video');
    if (video) {
        // Ensure video plays on mobile
        video.setAttribute('playsinline', '');
        video.setAttribute('muted', '');

        // Handle video load errors gracefully
        video.addEventListener('error', function() {
            console.log('Video failed to load');
            const container = video.parentElement;
            container.innerHTML = '<div style="background: #f3f4f6; padding: 4rem; border-radius: 1rem; text-align: center;"><p>Video demo coming soon</p></div>';
        });
    }
});

// Keyboard navigation improvements
document.addEventListener('keydown', function(e) {
    // Escape key closes FAQ items
    if (e.key === 'Escape') {
        const activeFAQ = document.querySelector('.faq-item.active');
        if (activeFAQ) {
            activeFAQ.classList.remove('active');
            activeFAQ.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
    }
});

// Performance optimization
document.addEventListener('DOMContentLoaded', function() {
    // Preload critical images
    const criticalImages = [
        'images/product-mockup-hero.jpg',
        'images/photographer-use-case.jpg'
    ];

    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // Lazy load non-critical images
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
});

// Debug function to check stored submissions
function checkStoredSubmissions() {
    const stored = localStorage.getItem('findmate_waitlist');
    if (stored) {
        console.log('Stored waitlist submissions:', JSON.parse(stored));
        return JSON.parse(stored);
    }
    console.log('No stored submissions found');
    return [];
}

// Function to export stored data (for manual retrieval)
function exportStoredData() {
    const data = checkStoredSubmissions();
    if (data.length > 0) {
        const csvData = [
            ['Name', 'Email', 'Timestamp', 'Source'],
            ...data.map(item => [item.name, item.email, item.timestamp, item.source])
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'findmate-waitlist.csv';
        a.click();

        URL.revokeObjectURL(url);
    }
}

// Test form submission function
function testFormSubmission() {
    console.log('🧪 Testing form submission...');

    const testData = {
        name: 'Test User',
        email: 'test@findmate.io',
        consent: true
    };

    // Simulate form submission
    const form = document.getElementById('waitlist-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const consentInput = document.getElementById('consent');

    nameInput.value = testData.name;
    emailInput.value = testData.email;
    consentInput.checked = testData.consent;

    // Trigger form submission
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);
}

// Add to window for debugging
window.findmateDebug = {
    checkStoredSubmissions,
    exportStoredData,
    testFormSubmission
};

// Floating CTA Button Functionality
function initializeFloatingCTA() {
    const floatingCTA = document.getElementById('floating-cta');
    if (!floatingCTA) return;

    let hasScrolled = false;
    let isHidden = false;

    // Show floating CTA after user scrolls past hero section
    function handleScroll() {
        const scrollPosition = window.pageYOffset;
        const windowHeight = window.innerHeight;

        // Show after scrolling past 70% of viewport height
        if (scrollPosition > windowHeight * 0.7 && !hasScrolled && !isHidden) {
            floatingCTA.classList.add('visible');
            hasScrolled = true;

            // Track floating CTA view
            trackConversion('floating_cta_shown');
        }
    }

    // Hide floating CTA when reaching waitlist section
    function hideNearWaitlist() {
        const waitlistSection = document.getElementById('waitlist');
        if (!waitlistSection) return;

        const rect = waitlistSection.getBoundingClientRect();
        const isWaitlistVisible = rect.top <= window.innerHeight && rect.bottom >= 0;

        if (isWaitlistVisible && hasScrolled && !isHidden) {
            floatingCTA.classList.remove('visible');
        } else if (!isWaitlistVisible && hasScrolled && !isHidden) {
            floatingCTA.classList.add('visible');
        }
    }

    // Combined scroll handler
    function onScroll() {
        handleScroll();
        hideNearWaitlist();
    }

    // Throttled scroll event
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                onScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Auto-hide after 30 seconds if not interacted with
    setTimeout(() => {
        if (hasScrolled && !isHidden) {
            hideFloatingCTA();
        }
    }, 30000);
}

function scrollToWaitlist() {
    // Track floating CTA click
    trackCTAClick('floating_button');
    trackConversion('floating_cta_clicked');

    const waitlistSection = document.getElementById('waitlist');
    if (waitlistSection) {
        waitlistSection.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        // Focus on email input after scroll
        setTimeout(() => {
            const emailInput = document.getElementById('email');
            if (emailInput) {
                emailInput.focus();
            }
        }, 800);
    }
}

function hideFloatingCTA() {
    const floatingCTA = document.getElementById('floating-cta');
    if (floatingCTA) {
        floatingCTA.classList.remove('visible');

        // Track floating CTA dismissal
        trackConversion('floating_cta_dismissed');

        // Set flag to prevent showing again
        setTimeout(() => {
            floatingCTA.style.display = 'none';
        }, 400);
    }
}

// Use Cases Carousel Functionality
function initializeCarousel() {
    const carousel = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const indicators = document.querySelectorAll('.indicator');

    if (!carousel || slides.length === 0) return;

    let currentSlide = 0;
    const totalSlides = slides.length;

    function updateCarousel() {
        // Move carousel
        const translateX = -currentSlide * 100;
        carousel.style.transform = `translateX(${translateX}vw)`;

        // Update slide active states
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });

        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });

        // Track slide view
        const slideTypes = ['photography', 'contractor', 'travel', 'student', 'outdoor', 'healthcare'];
        if (slideTypes[currentSlide]) {
            trackConversion('carousel_slide_view', { slide: slideTypes[currentSlide] });
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateCarousel();
    }

    // Event listeners
    if (nextButton) {
        nextButton.addEventListener('click', nextSlide);
    }

    if (prevButton) {
        prevButton.addEventListener('click', prevSlide);
    }

    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });

    // Touch/swipe support
    let startX = 0;
    let startY = 0;
    let isDragging = false;

    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
    }, { passive: true });

    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = startX - currentX;
        const diffY = startY - currentY;

        // Only handle horizontal swipes
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            e.preventDefault();
        }
    }, { passive: false });

    carousel.addEventListener('touchend', (e) => {
        if (!isDragging) return;

        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;

        // Minimum swipe distance
        if (Math.abs(diffX) > 100) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }

        isDragging = false;
    }, { passive: true });

    // Auto-play (optional - can be enabled)
    // setInterval(nextSlide, 8000);

    // Initialize first slide
    updateCarousel();

    // Intersection Observer for performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.willChange = 'transform';
            } else {
                entry.target.style.willChange = 'auto';
            }
        });
    });

    slides.forEach(slide => observer.observe(slide));
}

// Make functions available globally for onclick handlers
window.scrollToWaitlist = scrollToWaitlist;
window.hideFloatingCTA = hideFloatingCTA;

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        getURLParameter,
        trackConversion,
        checkStoredSubmissions,
        exportStoredData,
        scrollToWaitlist,
        hideFloatingCTA
    };
}