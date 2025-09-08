// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Scroll to top button
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Animated counters for highlight numbers
    const animateHighlightNumbers = () => {
        const counters = document.querySelectorAll('.highlight-number');
        
        counters.forEach(counter => {
            const finalText = counter.textContent;
            const isNumber = /^\d+\+?$/.test(finalText);
            
            if (isNumber) {
                const finalValue = parseInt(finalText.replace('+', ''));
                const hasPlus = finalText.includes('+');
                let currentValue = 0;
                const increment = finalValue / 30; // 30 steps
                
                const animate = () => {
                    currentValue += increment;
                    if (currentValue < finalValue) {
                        counter.textContent = Math.floor(currentValue) + (hasPlus ? '+' : '');
                        setTimeout(animate, 50);
                    } else {
                        counter.textContent = finalValue + (hasPlus ? '+' : '');
                    }
                };
                
                counter.textContent = '0' + (hasPlus ? '+' : '');
                animate();
            }
        });
    };

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                
                // Animate counters when tech-stack section is visible
                if (entry.target.classList.contains('tech-stack')) {
                    setTimeout(animateHighlightNumbers, 300);
                }
                
                // Animate feature cards with staggered delay
                if (entry.target.classList.contains('feature-card')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, delay);
                }
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });

    // Observe tech-stack section
    const techStackSection = document.querySelector('.tech-stack');
    if (techStackSection) {
        observer.observe(techStackSection);
    }

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });

    // Typing effect for rotating text
    function initTypingEffect() {
        const typingElement = document.getElementById('typing-text');
        const cursor = document.querySelector('.cursor');
        
        // Multiple phrases to cycle through for more engaging portfolio effect
        const phrases = [
            'luogo giusto',
            'tuo spazio',
            'posto perfetto',
            'tuo luogo ideale'
        ];
        
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 120;
        let deletingSpeed = 60;
        let pauseTime = 1500;

        function typeWriter() {
            const currentPhrase = phrases[phraseIndex];
            
            if (!isDeleting && charIndex < currentPhrase.length) {
                // Typing forward
                typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                setTimeout(typeWriter, typingSpeed + Math.random() * 50); // Add slight randomness
            } else if (!isDeleting && charIndex === currentPhrase.length) {
                // Pause at the end
                setTimeout(() => {
                    isDeleting = true;
                    typeWriter();
                }, pauseTime);
            } else if (isDeleting && charIndex > 0) {
                // Deleting backward
                typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                setTimeout(typeWriter, deletingSpeed);
            } else if (isDeleting && charIndex === 0) {
                // Move to next phrase
                phraseIndex = (phraseIndex + 1) % phrases.length;
                isDeleting = false;
                setTimeout(typeWriter, 300);
            }
        }

        // Start the typing effect after the hero animation
        setTimeout(() => {
            typeWriter();
        }, 1200);
    }

    // Initialize typing effect when page loads
    initTypingEffect();

    // Enhanced Screenshots carousel functionality
    const carousel = document.querySelector('.screenshots-carousel');
    const carouselContainer = document.querySelector('.carousel-container');
    const screenshots = document.querySelectorAll('.screenshot-item');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const progressBar = document.querySelector('.carousel-progress');
    
    let currentSlide = 0;
    let autoPlayInterval;
    let progressInterval;
    let isPaused = false;

    function showSlide(index, animated = true) {
        // Ensure index is within bounds
        currentSlide = ((index % screenshots.length) + screenshots.length) % screenshots.length;
        
        // Update carousel container position
        if (carouselContainer && animated) {
            carouselContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        } else if (carouselContainer) {
            carouselContainer.style.transition = 'none';
            carouselContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
            setTimeout(() => {
                carouselContainer.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }, 50);
        }
        
        // Remove active class from all screenshots and dots
        screenshots.forEach(screenshot => screenshot.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        if (screenshots[currentSlide]) {
            screenshots[currentSlide].classList.add('active');
        }
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
        
        // Reset and start progress bar animation
        if (progressBar && !isPaused) {
            progressBar.style.width = '0%';
            setTimeout(() => {
                progressBar.style.width = '100%';
            }, 50);
        }
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        if (progressInterval) clearInterval(progressInterval);
        
        isPaused = false;
        
        autoPlayInterval = setInterval(() => {
            if (!isPaused) {
                nextSlide();
            }
        }, 5000);
        
        // Start progress bar
        showSlide(currentSlide, false);
    }

    function pauseAutoPlay() {
        isPaused = true;
        if (progressBar) {
            progressBar.style.width = progressBar.style.width; // Freeze current width
        }
    }

    function resumeAutoPlay() {
        isPaused = false;
        showSlide(currentSlide, false);
    }

    // Initialize carousel
    if (carousel) {
        // Add click events to navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                pauseAutoPlay();
                prevSlide();
                setTimeout(resumeAutoPlay, 1000);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                pauseAutoPlay();
                nextSlide();
                setTimeout(resumeAutoPlay, 1000);
            });
        }

        // Add click events to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                pauseAutoPlay();
                showSlide(index);
                setTimeout(resumeAutoPlay, 1000);
            });
        });

        // Pause on hover
        carousel.addEventListener('mouseenter', pauseAutoPlay);
        carousel.addEventListener('mouseleave', resumeAutoPlay);

        // Touch/swipe support for mobile
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            pauseAutoPlay();
        });

        carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });

        carousel.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const diffX = startX - currentX;
            const threshold = 50;
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            
            isDragging = false;
            setTimeout(resumeAutoPlay, 1000);
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                pauseAutoPlay();
                prevSlide();
                setTimeout(resumeAutoPlay, 1000);
            } else if (e.key === 'ArrowRight') {
                pauseAutoPlay();
                nextSlide();
                setTimeout(resumeAutoPlay, 1000);
            }
        });

        // Start auto-play
        startAutoPlay();

        // Pause when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                pauseAutoPlay();
            } else {
                resumeAutoPlay();
            }
        });
    }


    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: ${type === 'success' ? '#4ECDC4' : type === 'error' ? '#FF6B6B' : '#FF6B35'};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 350px;
        `;
        
        const notificationContent = notification.querySelector('.notification-content');
        notificationContent.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        `;
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto remove after 5 seconds
        const autoRemoveTimer = setTimeout(() => {
            removeNotification(notification);
        }, 5000);
        
        // Close button functionality
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoRemoveTimer);
            removeNotification(notification);
        });
    }

    function removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // APK Download functionality
    const downloadBtn = document.querySelector('.btn-download');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            // Add download animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Show download notification
            setTimeout(() => {
                showNotification('Il download dell\'APK è iniziato!', 'success');
            }, 500);
        });
    }

    // Parallax effect for floating cards
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelectorAll('.floating-card');
        const speed = 0.5;

        parallax.forEach(card => {
            const yPos = -(scrolled * speed);
            card.style.transform = `translateY(${yPos}px)`;
        });
    });

    // Add hover effects to feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                pointer-events: none;
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-animation {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(1);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Loading animation for the page
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Start hero animations after page load
        const heroElements = document.querySelectorAll('.hero-title, .hero-description, .hero-buttons, .phone-mockup');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.animation = el.style.animation || 'slideInUp 1s ease forwards';
            }, index * 200);
        });
    });

    // Add loading class to body initially
    document.body.classList.add('loading');

    // Performance optimization: Throttle scroll events
    let ticking = false;
    
    function updateOnScroll() {
        // Update navbar
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        // Update scroll to top button
        const scrollToTopBtn = document.getElementById('scrollToTop');
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
});

// Service Worker Registration (for better performance)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }).catch(function(error) {
            console.log('ServiceWorker registration failed');
        });
    });
}

// Error handling for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Image failed to load:', this.src);
        });
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        if (navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
    
    // Tab navigation improvements
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

// Remove keyboard navigation class on mouse use
document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Add focus styles for keyboard navigation
const keyboardStyle = document.createElement('style');
keyboardStyle.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid #FF6B35 !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(keyboardStyle);