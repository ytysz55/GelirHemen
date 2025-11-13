// Smooth scroll for anchor links
const header = document.querySelector('.header');
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Phone and WhatsApp links are now handled directly via HTML href attributes

// Contact button functionality - WhatsApp redirect handled via HTML href
// No additional JavaScript needed as btn-contact is now an anchor tag

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.employee-card, .feature-item, .district-item, .review-card');
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// Parallax kodu kaldırıldı (ölü kod temizliği)

// Add hover effect to cards with scale animation
const cards = document.querySelectorAll('.employee-card, .review-card, .district-item');
cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// Lazy loading for images and responsive sources
const loadLazyImage = (img) => {
    if (!img) {
        return;
    }

    const picture = img.closest('picture');
    if (picture) {
        picture.querySelectorAll('source[data-srcset]').forEach(source => {
            if (source.dataset.srcset) {
                source.srcset = source.dataset.srcset;
                source.removeAttribute('data-srcset');
            }
            if (source.dataset.sizes) {
                source.sizes = source.dataset.sizes;
                source.removeAttribute('data-sizes');
            }
        });
    }

    if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
    }

    if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
        img.removeAttribute('data-srcset');
    }

    if (img.dataset.sizes) {
        img.sizes = img.dataset.sizes;
        img.removeAttribute('data-sizes');
    }

    img.classList.add('loaded');
};

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }

            const img = entry.target;
            loadLazyImage(img);
            observer.unobserve(img);
        });
    }, {
        rootMargin: '0px 0px 100px 0px'
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
} else {
    document.querySelectorAll('img[data-src]').forEach(img => loadLazyImage(img));
}

// Add ripple effect to buttons
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    ripple.style.top = `${event.clientY - button.offsetTop - radius}px`;
    ripple.classList.add('ripple');

    const rippleElement = button.getElementsByClassName('ripple')[0];
    if (rippleElement) {
        rippleElement.remove();
    }

    button.appendChild(ripple);
}

// Helper: resolve district slug/name from URL or query params
function getDistrictContext() {
    const urlParams = new URLSearchParams(window.location.search);
    let slug = urlParams.get('ilce');

    if (!slug) {
        const pathMatch = window.location.pathname.match(/^\/([a-z0-9-]+)-elektrikci\/?$/i);
        if (pathMatch) {
            slug = pathMatch[1].toLowerCase();
        }
    }

    if (!slug) {
        return null;
    }

    const districtLinks = document.querySelectorAll('.district-link');
    for (const link of districtLinks) {
        const linkSlug = (link.dataset.slug || '').toLowerCase();
        if (linkSlug === slug.toLowerCase()) {
            return {
                slug: linkSlug,
                districtName: link.getAttribute('data-district')
            };
        }
    }

    return null;
}

// SEO: Update header title, meta description and canonical URL based on URL parameter
function updateHeaderForDistrict() {
    const headerTitle = document.querySelector('.header-title');
    const districtContext = getDistrictContext();

    if (headerTitle && districtContext) {
        const { districtName, slug } = districtContext;
        const districtUrl = `https://www.gelirhemen.com/${slug}-elektrikci`;

        // Update page title
        headerTitle.textContent = `${districtName} Elektrikçi: En İyi Hizmet ve Fiyat İçin İletişime Geçin`;
        document.title = `${districtName} Elektrikçi - 7/24 Acil Elektrik Tamiri | GelirHemen`;
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 
                `${districtName} Elektrikçi Hizmeti - 7/24 Profesyonel Elektrik Arıza ve Montaj. ${districtName}'da hızlı, güvenilir ve uygun fiyatlı elektrikçi hizmeti.`
            );
        }
        
        // Update canonical URL
        const canonicalLink = document.querySelector('link[rel="canonical"]');
        if (canonicalLink) {
            canonicalLink.setAttribute('href', districtUrl);
        }
        
        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute('content', `${districtName} Elektrikçi - 7/24 Acil Elektrik Tamiri`);
        }
        
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
            ogDescription.setAttribute('content', 
                `${districtName}'da 7/24 profesyonel elektrikçi hizmeti. Elektrik arızaları, avize montajı ve tüm elektrik işleriniz için hızlı çözüm.`
            );
        }
        
        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) {
            ogUrl.setAttribute('content', districtUrl);
        }
        
        // Update Twitter Card tags
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle) {
            twitterTitle.setAttribute('content', `${districtName} Elektrikçi - 7/24 Acil Elektrik Tamiri`);
        }
        
        const twitterDescription = document.querySelector('meta[name="twitter:description"]');
        if (twitterDescription) {
            twitterDescription.setAttribute('content', 
                `${districtName}'da 7/24 profesyonel elektrikçi hizmeti. Elektrik arızaları, avize montajı ve tüm elektrik işleriniz için hızlı çözüm.`
            );
        }

        const twitterUrl = document.querySelector('meta[name="twitter:url"]');
        if (twitterUrl) {
            twitterUrl.setAttribute('content', districtUrl);
        }
    }
}

// Update structured data for district pages
function updateStructuredDataForDistrict() {
    const districtContext = getDistrictContext();

    if (districtContext) {
        const { districtName, slug } = districtContext;
        const districtUrl = `https://www.gelirhemen.com/${slug}-elektrikci`;

        const updateSchemaWithDistrict = (schema) => {
            if (!schema || typeof schema !== 'object') {
                return false;
            }

            if (Array.isArray(schema)) {
                return schema.reduce((updated, item) => updateSchemaWithDistrict(item) || updated, false);
            }

            let updated = false;

            if (schema['@type'] === 'LocalBusiness') {
                if (!schema.address || typeof schema.address !== 'object') {
                    schema.address = {};
                }

                if (!schema.address['@type']) {
                    schema.address['@type'] = 'PostalAddress';
                }

                if (schema.address.addressLocality !== districtName) {
                    schema.address.addressLocality = districtName;
                    updated = true;
                }

                if (schema.areaServed) {
                    if (Array.isArray(schema.areaServed)) {
                        const existing = schema.areaServed.find(item => item && item['@type'] === 'City');
                        if (existing && existing.name !== districtName) {
                            existing.name = districtName;
                            updated = true;
                        }
                    } else if (typeof schema.areaServed === 'object') {
                        if (!schema.areaServed['@type']) {
                            schema.areaServed['@type'] = 'City';
                        }
                        if (schema.areaServed.name !== districtName) {
                            schema.areaServed.name = districtName;
                            updated = true;
                        }
                    }
                }
            }

            if (schema['@type'] === 'Service') {
                if (!schema.areaServed || typeof schema.areaServed !== 'object') {
                    schema.areaServed = {
                        "@type": 'City',
                        name: districtName
                    };
                    updated = true;
                } else {
                    if (!schema.areaServed['@type']) {
                        schema.areaServed['@type'] = 'City';
                        updated = true;
                    }
                    if (schema.areaServed.name !== districtName) {
                        schema.areaServed.name = districtName;
                        updated = true;
                    }
                }
            }

            return updated;
        };

        const structuredDataScripts = document.querySelectorAll('script[type="application/ld+json"]');
        structuredDataScripts.forEach(script => {
            try {
                const schemaData = JSON.parse(script.textContent);
                if (updateSchemaWithDistrict(schemaData)) {
                    script.textContent = JSON.stringify(schemaData, null, 2);
                }
            } catch (error) {
                // Schema update error - silently fail
            }
        });

        // Update breadcrumb structured data across all ld+json scripts
        const ldScripts = document.querySelectorAll('script[type="application/ld+json"]');
        ldScripts.forEach(script => {
            try {
                const data = JSON.parse(script.textContent);
                const findBreadcrumb = (obj) => {
                    if (!obj) return null;
                    if (Array.isArray(obj)) {
                        for (const item of obj) {
                            const found = findBreadcrumb(item);
                            if (found) return found;
                        }
                        return null;
                    }
                    if (obj['@type'] === 'BreadcrumbList') return obj;
                    return null;
                };

                const breadcrumbData = findBreadcrumb(data);
                if (breadcrumbData && Array.isArray(breadcrumbData.itemListElement)) {
                    const alreadyExists = breadcrumbData.itemListElement.some(item => item.item === districtUrl);
                    if (!alreadyExists) {
                        breadcrumbData.itemListElement.push({
                            "@type": "ListItem",
                            "position": breadcrumbData.itemListElement.length + 1,
                            "name": `${districtName} Elektrikçi`,
                            "item": districtUrl
                        });
                        script.textContent = JSON.stringify(data, null, 2);
                    }
                }
            } catch (e) {
                // ignore JSON parse errors
            }
        });
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    updateHeaderForDistrict();
    updateStructuredDataForDistrict();

    // Update H1 when .header-title appears later in the DOM
    const observeHeaderTitle = () => {
        if (document.querySelector('.header-title')) {
            updateHeaderForDistrict();
            return true;
        }
        return false;
    };
    observeHeaderTitle();
    const headerObserver = new MutationObserver(() => {
        if (observeHeaderTitle()) {
            headerObserver.disconnect();
        }
    });
    headerObserver.observe(document.body, { childList: true, subtree: true });

    // FAQ accordion behavior
    const faqToggles = document.querySelectorAll('.faq-toggle');
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            const panel = toggle.nextElementSibling;

            if (!panel) {
                return;
            }

            // Close others
            faqToggles.forEach(otherToggle => {
                const otherPanel = otherToggle.nextElementSibling;
                if (otherToggle !== toggle && otherPanel) {
                    otherToggle.setAttribute('aria-expanded', 'false');
                    otherPanel.hidden = true;
                }
            });

            toggle.setAttribute('aria-expanded', String(!isExpanded));
            panel.hidden = isExpanded;
        });
    });

    // Blog enhancements: TOC, reading time, breadcrumbs schema
    const blogArticle = document.querySelector('.blog-article');
    if (blogArticle) {
        // Ensure headings have ids and build TOC
        const headings = blogArticle.querySelectorAll('h2, h3');
        const toc = document.querySelector('.blog-toc');
        if (toc && headings.length) {
            const ul = document.createElement('ul');
            headings.forEach(h => {
                if (!h.id) {
                    const slug = (h.textContent || '').toLowerCase().trim()
                        .replace(/[^a-z0-9ğüşöçı\s-]/gi, '')
                        .replace(/\s+/g, '-');
                    h.id = slug || `baslik-${Math.random().toString(36).slice(2, 8)}`;
                }
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `#${h.id}`;
                a.textContent = h.textContent || '';
                li.appendChild(a);
                ul.appendChild(li);
            });
            toc.appendChild(ul);
        }

        // Reading time and meta
        const text = blogArticle.textContent || '';
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        const minutes = Math.max(1, Math.ceil(words / 180));
        const metaBar = document.querySelector('.blog-meta');

        // Try to read publish date from Article JSON-LD
        let published = '';
        const ld = document.querySelectorAll('script[type="application/ld+json"]');
        for (const s of ld) {
            try {
                const data = JSON.parse(s.textContent);
                if (data && data['@type'] === 'Article' && data.datePublished) {
                    published = data.datePublished;
                    break;
                }
            } catch {}
        }
        if (metaBar) {
            metaBar.innerHTML = `
                <span><i class="far fa-calendar"></i> ${published || ''}</span>
                <span><i class="far fa-clock"></i> ${minutes} dk okuma</span>
            `;
        }

        // BreadcrumbList JSON-LD
        const pageTitle = document.title.replace(/\s*\|.*$/, '').trim();
        const blogUrl = `${location.origin}/blog/`;
        const currentUrl = location.href;
        const breadcrumbLd = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": location.origin + '/'},
                {"@type": "ListItem", "position": 2, "name": "Blog", "item": blogUrl},
                {"@type": "ListItem", "position": 3, "name": pageTitle, "item": currentUrl}
            ]
        };
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(breadcrumbLd);
        document.head.appendChild(script);
    }
});

// Toggle service tags
function toggleTags(button) {
    const tagsContainer = button.parentElement;
    const hiddenTags = tagsContainer.querySelectorAll('.service-tag-hidden');
    
    hiddenTags.forEach(tag => {
        if (tag.style.display === 'none' || tag.style.display === '') {
            tag.style.display = 'inline-block';
        } else {
            tag.style.display = 'none';
        }
    });
    
    button.classList.toggle('active');
    
    if (button.classList.contains('active')) {
        button.innerHTML = 'Daha Az <i class="fas fa-chevron-up"></i>';
    } else {
        button.innerHTML = 'Daha Fazla <i class="fas fa-chevron-down"></i>';
    }
}

document.querySelectorAll('.btn-whatsapp, .btn-call-link, .btn-contact').forEach(button => {
    button.addEventListener('click', createRipple);
});

// Add CSS for ripple effect dynamically
const style = document.createElement('style');
style.textContent = `
    .btn-whatsapp, .btn-contact, .btn-call-link {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Eski placeholder scroll dinleyicisi kaldırıldı

// Add active state to navigation on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Kullanılmayan debouncedScroll kaldırıldı

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Fade in all lazy images
    document.querySelectorAll('.lazy-image').forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        }
    });
});

// Back to top button logic
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
    const toggleBackToTop = () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    };

    const debouncedToggle = debounce(toggleBackToTop, 50);
    window.addEventListener('scroll', debouncedToggle, { passive: true });
    window.addEventListener('load', toggleBackToTop);

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Mobile menu toggle (if needed in future)
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        document.querySelector('.nav-menu').classList.toggle('active');
    });
}

// Add smooth reveal animation for elements
const revealElements = () => {
    const reveals = document.querySelectorAll('.employee-card, .feature-item, .district-item, .review-card');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealElements);
revealElements(); // Initial check on page load
