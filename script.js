// Enhanced Portfolio JavaScript
// Professional implementation with performance optimizations and smooth animations

class PortfolioApp {
    constructor() {
        this.isLoading = true;
        this.currentSection = 'home';
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }

    // Initialize all functionality
    init() {
        this.setupEventListeners();
        this.initializePlugins();
        this.createBackgroundEffects();
        this.setupIntersectionObserver();
        this.handleLoading();
        this.initializeCursor();
        
        // Performance optimization: Debounce scroll events
        this.debouncedScrollHandler = this.debounce(this.handleScroll.bind(this), 10);
        window.addEventListener('scroll', this.debouncedScrollHandler, { passive: true });
    }

    // Handle page loading
    handleLoading() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loading-screen');
                if (loadingScreen) {
                    loadingScreen.classList.add('hidden');
                    this.isLoading = false;
                    this.animateOnLoad();
                }
            }, 1000);
        });
    }

    // Setup all event listeners
    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu(mobileMenuBtn, mobileMenu);
            });
        }

        // Navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleNavClick(e);
            });
        });

        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                this.handleFormSubmission(e);
            });
        }

        // Scroll to top button
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener('click', () => {
                this.scrollToTop();
            });
        }

        // Window resize handler
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
    }

    // Initialize external plugins
    initializePlugins() {
        // Initialize Lucide Icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Initialize Typed.js
        if (typeof Typed !== 'undefined') {
            this.initializeTypedText();
        }
    }

    // Initialize typed text animation
    initializeTypedText() {
        const typedElement = document.getElementById('typed-text');
        if (typedElement) {
            new Typed('#typed-text', {
                strings: [
                    'Full Stack Developer',
                    'Software Engineer', 
                    'Problem Solver',
                    'Tech Innovator'
                ],
                typeSpeed: 60,
                backSpeed: 40,
                backDelay: 2000,
                loop: true,
                showCursor: true,
                cursorChar: '|',
                autoInsertCss: true
            });
        }
    }

    // Create animated background effects
    createBackgroundEffects() {
        this.createParticles();
        this.animateBackgroundBlurs();
    }

    // Create floating particles
    createParticles() {
        const particlesContainer = document.getElementById('particles-container');
        if (!particlesContainer) return;

        const particleCount = window.innerWidth < 768 ? 15 : 25;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random positioning and timing
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = (Math.random() * 8 + 7) + 's';
            
            particlesContainer.appendChild(particle);
        }
    }

    // Animate background blur elements
    animateBackgroundBlurs() {
        const blurs = document.querySelectorAll('.bg-blur');
        blurs.forEach((blur, index) => {
            blur.style.animationDelay = index * 2 + 's';
        });
    }

    // Initialize custom cursor
    initializeCursor() {
        if (window.innerWidth < 1024) return; // Skip on mobile/tablet

        const cursor = document.getElementById('cursor-follower');
        if (!cursor) return;

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.opacity = '0.8';
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });

        const animateCursor = () => {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            
            cursorX += dx * 0.1;
            cursorY += dy * 0.1;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(animateCursor);
        };

        animateCursor();

        // Add cursor effects on hover
        document.querySelectorAll('a, button, .project-card, .skill-card').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('active'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
        });
    }

    // Setup Intersection Observer for animations
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Add staggered animation delays for child elements
                    const animatedChildren = entry.target.querySelectorAll('[data-aos]');
                    animatedChildren.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('aos-animate');
                        }, index * 100);
                    });
                }
            });
        }, this.observerOptions);

        // Observe all reveal elements
        document.querySelectorAll('.section-reveal').forEach(section => {
            observer.observe(section);
        });
    }

    // Handle mobile menu toggle
    toggleMobileMenu(button, menu) {
        const isActive = button.classList.contains('active');
        
        if (isActive) {
            button.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            button.classList.add('active');
            menu.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Handle navigation clicks
    handleNavClick(e) {
        e.preventDefault();
        const href = e.currentTarget.getAttribute('href');
        
        if (href.startsWith('#')) {
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                this.scrollToSection(targetElement, targetId);
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                const mobileMenuBtn = document.getElementById('mobile-menu-button');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    this.toggleMobileMenu(mobileMenuBtn, mobileMenu);
                }
            }
        }
    }

    // Smooth scroll to section - Fixed for full screen
    scrollToSection(element, sectionId) {
        const headerHeight = document.getElementById('header').offsetHeight;
        const elementPosition = element.offsetTop - headerHeight;

        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });

        // Update current section
        this.currentSection = sectionId;
        this.updateActiveNavLink(sectionId);
    }

    // Update active navigation link
    updateActiveNavLink(sectionId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // Handle scroll events
    handleScroll() {
        const scrollY = window.pageYOffset;
        
        // Update header appearance
        this.updateHeader(scrollY);
        
        // Update scroll to top button
        this.updateScrollToTopButton(scrollY);
        
        // Update active navigation based on scroll position
        this.updateActiveNavOnScroll();
        
        // Parallax effects
        this.handleParallaxEffects(scrollY);
    }

    // Update header on scroll
    updateHeader(scrollY) {
        const header = document.getElementById('header');
        if (!header) return;

        if (scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Update scroll to top button visibility
    updateScrollToTopButton(scrollY) {
        const button = document.getElementById('scrollToTopBtn');
        if (!button) return;

        if (scrollY > 500) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    }

    // Update active navigation based on scroll position
    updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + window.innerHeight / 3;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                if (this.currentSection !== sectionId) {
                    this.currentSection = sectionId;
                    this.updateActiveNavLink(sectionId);
                }
            }
        });
    }

    // Handle parallax effects (minimal)
    handleParallaxEffects(scrollY) {
        // Removed hero image parallax to keep it fixed
        // Removed floating cards as they no longer exist
        
        // Subtle background parallax only
        const bgBlurs = document.querySelectorAll('.bg-blur');
        bgBlurs.forEach((blur, index) => {
            const speed = scrollY * (0.02 + index * 0.01);
            blur.style.transform = `translateY(${speed}px)`;
        });
    }

    // Handle form submission
    async handleFormSubmission(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const statusElement = document.getElementById('form-status');
        const submitButton = form.querySelector('.form-submit');
        
        if (!statusElement || !submitButton) return;

        try {
            // Show loading state
            submitButton.disabled = true;
            submitButton.querySelector('.btn-text').textContent = 'Sending...';
            statusElement.textContent = 'Sending your message...';
            statusElement.className = 'form-status show';

            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success
                statusElement.textContent = 'Message sent successfully! I\'ll get back to you soon.';
                statusElement.className = 'form-status show success';
                form.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            // Error
            statusElement.textContent = 'Failed to send message. Please try again or contact me directly.';
            statusElement.className = 'form-status show error';
            console.error('Form submission error:', error);
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.querySelector('.btn-text').textContent = 'Send Message';
            
            // Hide status after 5 seconds
            setTimeout(() => {
                statusElement.classList.remove('show');
            }, 5000);
        }
    }

    // Scroll to top smoothly
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Handle keyboard navigation
    handleKeyboardNavigation(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape') {
            const mobileMenu = document.getElementById('mobile-menu');
            const mobileMenuBtn = document.getElementById('mobile-menu-button');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                this.toggleMobileMenu(mobileMenuBtn, mobileMenu);
            }
        }
    }

    // Handle window resize
    handleResize() {
        // Recreate particles on resize
        const particlesContainer = document.getElementById('particles-container');
        if (particlesContainer) {
            particlesContainer.innerHTML = '';
            this.createParticles();
        }
        
        // Update mobile menu state
        if (window.innerWidth > 768) {
            const mobileMenu = document.getElementById('mobile-menu');
            const mobileMenuBtn = document.getElementById('mobile-menu-button');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                this.toggleMobileMenu(mobileMenuBtn, mobileMenu);
            }
        }
    }

    // Animate elements on page load
    animateOnLoad() {
        // Stagger animation for hero elements
        const heroElements = document.querySelectorAll('#home .hero-intro > *, #home .hero-description, #home .social-links, #home .hero-actions');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                
                // Trigger animation
                requestAnimationFrame(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                });
            }, index * 200);
        });

        // Animate hero image
        setTimeout(() => {
            const heroImage = document.querySelector('.hero-image-wrapper');
            if (heroImage) {
                heroImage.style.opacity = '0';
                heroImage.style.transform = 'scale(0.8) translateY(30px)';
                heroImage.style.transition = 'all 1s cubic-bezier(0.25, 0.25, 0.25, 1)';
                
                requestAnimationFrame(() => {
                    heroImage.style.opacity = '1';
                    heroImage.style.transform = 'scale(1) translateY(0)';
                });
            }
        }, 400);

        // Show cursor after animations
        setTimeout(() => {
            const cursor = document.getElementById('cursor-follower');
            if (cursor) {
                cursor.style.opacity = '0.8';
            }
        }, 1000);
    }

    // Utility function: Debounce
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // Utility function: Throttle
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Add smooth hover effects for cards
    addCardHoverEffects() {
        const cards = document.querySelectorAll('.skill-card, .project-card, .achievement-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function(e) {
                this.style.transform = 'translateY(-10px) scale(1.02)';
                
                // Add glow effect
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                this.style.setProperty('--mouse-x', x + 'px');
                this.style.setProperty('--mouse-y', y + 'px');
                this.classList.add('card-hover');
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.classList.remove('card-hover');
            });
            
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                this.style.setProperty('--mouse-x', x + 'px');
                this.style.setProperty('--mouse-y', y + 'px');
            });
        });
    }

    // Initialize skill progress animations
    initializeSkillAnimations() {
        const skillItems = document.querySelectorAll('.skill-list li');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateX(-20px)';
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }, Math.random() * 300);
                }
            });
        });

        skillItems.forEach(item => observer.observe(item));
    }

    // Add timeline item animations
    initializeTimelineAnimations() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const content = entry.target.querySelector('.timeline-content');
                    const marker = entry.target.querySelector('.timeline-marker');
                    
                    if (content && marker) {
                        content.style.opacity = '0';
                        content.style.transform = 'translateY(30px) scale(0.95)';
                        content.style.transition = 'all 0.8s cubic-bezier(0.25, 0.25, 0.25, 1)';
                        
                        marker.style.opacity = '0';
                        marker.style.transform = 'scale(0)';
                        marker.style.transition = 'all 0.6s cubic-bezier(0.25, 0.25, 0.25, 1)';
                        
                        setTimeout(() => {
                            marker.style.opacity = '1';
                            marker.style.transform = 'scale(1)';
                        }, 200);
                        
                        setTimeout(() => {
                            content.style.opacity = '1';
                            content.style.transform = 'translateY(0) scale(1)';
                        }, 400);
                    }
                }
            });
        }, { threshold: 0.3 });

        timelineItems.forEach(item => observer.observe(item));
    }

    // Initialize all additional features
    initializeAdvancedFeatures() {
        this.addCardHoverEffects();
        this.initializeSkillAnimations();
        this.initializeTimelineAnimations();
    }
}

// Initialize the portfolio app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const portfolioApp = new PortfolioApp();
    
    // Initialize advanced features after a short delay
    setTimeout(() => {
        portfolioApp.initializeAdvancedFeatures();
    }, 1500);
});

// Handle page visibility changes for performance optimization
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.classList.add('page-hidden');
    } else {
        // Resume animations when page becomes visible
        document.body.classList.remove('page-hidden');
    }
});

// Add CSS for page hidden state
const style = document.createElement('style');
style.textContent = `
    .page-hidden * {
        animation-play-state: paused !important;
    }
    
    .card-hover::before {
        content: '';
        position: absolute;
        top: var(--mouse-y);
        left: var(--mouse-x);
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, rgba(96, 165, 250, 0.1) 0%, transparent 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style);