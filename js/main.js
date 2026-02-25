// Main JavaScript for Ngao Labs Website
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initSmoothScrolling();
    initScrollEffects();
    initAnimations();
    initFormValidation();
    initNewsletterSignup();
    initIntersectionObserver();
    initFAQ();
    initBackToTop();
    initThemeToggle();
    initReadingProgress();
});

// Reading Progress functionality
function initReadingProgress() {
    const progress = document.querySelector('.reading-progress');
    if (!progress) return;

    window.addEventListener('scroll', () => {
        const windowScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (windowScroll / height) * 100;
        progress.style.width = scrolled + '%';
    });
}

// Theme Toggle functionality
function initThemeToggle() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    const themeToggleBtn = document.createElement('button');
    themeToggleBtn.className = 'theme-toggle';
    themeToggleBtn.innerHTML = `
        <i class="fas fa-moon" title="Switch to dark mode"></i>
        <i class="fas fa-sun" title="Switch to light mode"></i>
    `;
    themeToggleBtn.setAttribute('aria-label', 'Toggle theme');

    const navContainer = document.querySelector('.nav-container');
    const hamburger = document.querySelector('.hamburger');
    
    if (navContainer) {
        // Insert before hamburger or as last item
        if (hamburger) {
            navContainer.insertBefore(themeToggleBtn, hamburger);
        } else {
            navContainer.appendChild(themeToggleBtn);
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Show feedback toast
        showToast(`Switched to ${theme} mode`, 'info');
    });
}

// Back to Top functionality
function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            const isExpanded = hamburger.classList.contains('active');
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Update ARIA attribute
            hamburger.setAttribute('aria-expanded', !isExpanded);
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (hamburger && navMenu && !hamburger.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });

    // Active navigation highlighting
    highlightActiveNavLink();
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll effects and animations
function initScrollEffects() {
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Counter animation for stats
    const counters = document.querySelectorAll('.stat-number');
    const animateCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target') || counter.textContent.replace(/\D/g, ''));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current) + (counter.textContent.includes('+') ? '+' : '') + (counter.textContent.includes('%') ? '%' : '');
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + (counter.textContent.includes('+') ? '+' : '') + (counter.textContent.includes('%') ? '%' : '');
                }
            };
            
            updateCounter();
        });
    };

    // Trigger counter animation when stats section is visible
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(statsSection);
    }
}

// Initialize animations
function initAnimations() {
    // Add animation classes to elements when they come into view
    const animatedElements = document.querySelectorAll('.about-card, .week-card, .testimonial-card, .feature');
    
    animatedElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
    });

    // Trigger animations on scroll
    const triggerAnimation = (element) => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    };

    // Simple scroll animation trigger
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        animatedElements.forEach(element => {
            const elementTop = element.offsetTop;
            if (scrolled + windowHeight > elementTop + 100) {
                triggerAnimation(element);
            }
        });
    });
}

// Form validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
        
        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                handleFormSubmission(this);
            }
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }

    // URL validation
    if (field.type === 'url' && value) {
        try {
            new URL(value);
        } catch {
            isValid = false;
            errorMessage = 'Please enter a valid URL';
        }
    }

    // File validation
    if (field.type === 'file' && field.files.length > 0) {
        const file = field.files[0];
        const allowedTypes = ['.pdf', '.doc', '.docx'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedTypes.includes(fileExtension)) {
            isValid = false;
            errorMessage = 'Please upload a PDF, DOC, or DOCX file';
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            isValid = false;
            errorMessage = 'File size must be less than 5MB';
        }
    }

    // Update field state
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }

    return isValid;
}

// Show field error
function showFieldError(field, message) {
    const errorSpan = field.parentNode.querySelector('.error-message');
    if (errorSpan) {
        errorSpan.textContent = message;
        field.parentNode.classList.add('error');
    }
}

// Clear field error
function clearFieldError(field) {
    const errorSpan = field.parentNode.querySelector('.error-message');
    if (errorSpan) {
        errorSpan.textContent = '';
        field.parentNode.classList.remove('error');
    }
}

// Validate entire form
function validateForm(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Handle form submission
function handleFormSubmission(form) {
	const submitBtn = form.querySelector('button[type="submit"]');
	const originalText = submitBtn.innerHTML;

	// Show loading state
	submitBtn.classList.add('loading');
	submitBtn.disabled = true;

	const action = form.getAttribute('action') || (form.id === 'applicationForm' ? '/api/apply' : form.id === 'contactForm' ? '/api/contact' : '/api/contact');
	const useFormData = true;

	let body;
	let headers = { 'Accept': 'application/json' };
	if (useFormData) {
		body = new FormData(form);
	} else {
		headers['Content-Type'] = 'application/json';
		const payload = Object.fromEntries(new FormData(form).entries());
		body = JSON.stringify(payload);
	}

	if (location.protocol === 'file:') {
		setTimeout(() => {
			form.style.display = 'none';
			const formHeader = form.closest('.form-container').querySelector('.form-header');
			if (formHeader) formHeader.style.display = 'none';
			const successMessage = form.parentNode.querySelector('.success-message');
			if (successMessage) successMessage.style.display = 'block';
			form.reset();
			submitBtn.classList.remove('loading');
			submitBtn.disabled = false;
			submitBtn.innerHTML = originalText;
		}, 300);
		return;
	}

	fetch(action, {
		method: 'POST',
		headers,
		body
	})
	.then(async (res) => {
		if (!res.ok) {
			const err = await res.json().catch(() => ({ message: 'Submission failed' }));
			throw new Error(err.message || 'Submission failed');
		}
		return res.json();
	})
	.then(() => {
		// Hide form and show success message
		form.style.display = 'none';
		const formHeader = form.closest('.form-container').querySelector('.form-header');
		if (formHeader) formHeader.style.display = 'none';
		const successMessage = form.parentNode.querySelector('.success-message');
		if (successMessage) successMessage.style.display = 'block';
		form.reset();
	})
	.catch((e) => {
		alert(e.message || 'Something went wrong. Please try again.');
	})
	.finally(() => {
		submitBtn.classList.remove('loading');
		submitBtn.disabled = false;
		submitBtn.innerHTML = originalText;
	});
}

// Newsletter signup functionality
function initNewsletterSignup() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button');
            const originalBtnText = submitBtn.textContent;
            
            if (validateEmail(emailInput.value)) {
                // Show loading state
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
                
                // Simulate API call
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                    submitBtn.classList.add('btn-success');
                    emailInput.value = '';
                    
                    // Show success message
                    showToast('Thanks for subscribing! Check your email to confirm.', 'success');
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalBtnText;
                        submitBtn.classList.remove('btn-success');
                    }, 3000);
                }, 1500);
            } else {
                showToast('Please enter a valid email address.', 'error');
                emailInput.focus();
            }
        });
    });
}

// Utility function to show toast messages
function showToast(message, type = 'info') {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        </div>
        <div class="toast-content">${message}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('visible'), 10);
    
    // Remove after 5 seconds
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Helper to validate email
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Intersection Observer for scroll animations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in-on-scroll, .stagger-item');
    animatedElements.forEach(el => observer.observe(el));
}

// Highlight active navigation link
function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Utility functions
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

function throttle(func, limit) {
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

// Performance optimization
const optimizedScrollHandler = throttle(() => {
    // Handle scroll events efficiently
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if images exist
if (document.querySelectorAll('img[data-src]').length > 0) {
    initLazyLoading();
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You can add error reporting logic here
});

// FAQ Accordion Functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(faqItem => {
                    faqItem.classList.remove('active');
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

// Console welcome message
console.log('%cWelcome to Ngao Labs! 🚀', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cWe\'re building the future of data science education together.', 'color: #4a5568; font-size: 14px;');
