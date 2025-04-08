// Main JavaScript file for CampusCraze PWA

// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
const prevButton = document.querySelector('.testimonial-nav .prev');
const nextButton = document.querySelector('.testimonial-nav .next');
const testimonialCarousel = document.querySelector('.testimonial-carousel');
const testimonials = document.querySelectorAll('.testimonial');
const productCards = document.querySelectorAll('.product-card');
const bundleCards = document.querySelectorAll('.bundle-card');
const addToCartButtons = document.querySelectorAll('.bundle-card .primary-btn');

// Create scroll indicator
const scrollIndicator = document.createElement('div');
scrollIndicator.className = 'scroll-indicator';
document.body.prepend(scrollIndicator);

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', !expanded);
  nav.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (nav.classList.contains('active') && 
      !nav.contains(e.target) && 
      !menuToggle.contains(e.target)) {
    nav.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

// Testimonial carousel navigation
let currentPosition = 0;
const testimonialWidth = testimonials.length > 0 ? testimonials[0].offsetWidth + 30 : 0; // width + gap

function updateCarouselPosition() {
  testimonialCarousel.scrollTo({
    left: currentPosition * testimonialWidth,
    behavior: 'smooth'
  });
}

if (prevButton && nextButton) {
  prevButton.addEventListener('click', () => {
    if (currentPosition > 0) {
      currentPosition--;
      updateCarouselPosition();
    }
  });
  
  nextButton.addEventListener('click', () => {
    if (currentPosition < testimonials.length - 1) {
      currentPosition++;
      updateCarouselPosition();
    }
  });
}

// Auto-rotate testimonials every 5 seconds
let autoRotateInterval;

function startAutoRotate() {
  autoRotateInterval = setInterval(() => {
    if (currentPosition < testimonials.length - 1) {
      currentPosition++;
    } else {
      currentPosition = 0;
    }
    updateCarouselPosition();
  }, 5000);
}

function stopAutoRotate() {
  clearInterval(autoRotateInterval);
}

// Start/stop auto-rotate on hover
if (testimonialCarousel) {
  startAutoRotate();
  
  testimonialCarousel.addEventListener('mouseenter', stopAutoRotate);
  testimonialCarousel.addEventListener('mouseleave', startAutoRotate);
  testimonialCarousel.addEventListener('touchstart', stopAutoRotate, { passive: true });
  testimonialCarousel.addEventListener('touchend', startAutoRotate);
}

// Lazy loading images
const lazyImages = document.querySelectorAll('img[loading="lazy"]');

if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => {
    img.classList.add('lazy-load');
    imageObserver.observe(img);
  });
}

// Add to cart animation
addToCartButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Add animation class
    button.classList.add('add-to-cart-animation');
    
    // Show toast notification
    showToast('Added to cart!');
    
    // Remove animation class after animation completes
    setTimeout(() => {
      button.classList.remove('add-to-cart-animation');
    }, 500);
  });
});

// Toast notification function
function showToast(message, duration = 3000) {
  // Create toast element if it doesn't exist
  let toast = document.querySelector('.toast');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  
  // Set message and show toast
  toast.textContent = message;
  toast.classList.add('show');
  
  // Hide toast after duration
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// Update scroll indicator
window.addEventListener('scroll', () => {
  const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPosition = window.scrollY;
  const scrollPercentage = (scrollPosition / windowHeight) * 100;
  
  scrollIndicator.style.width = `${scrollPercentage}%`;
});

// Intersection Observer for animations
if ('IntersectionObserver' in window) {
  const options = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      
      entry.target.classList.add('appear');
      observer.unobserve(entry.target);
    });
  }, options);
  
  // Apply to product and bundle cards
  document.querySelectorAll('.product-card, .bundle-card').forEach(card => {
    card.classList.add('fade-in-element');
    appearOnScroll.observe(card);
  });
}

// Performance optimization
document.addEventListener('DOMContentLoaded', () => {
  // Preload critical images
  const preloadImages = [
    'images/college-vibes.webp',
    'images/logo.svg'
  ];
  
  preloadImages.forEach(imageSrc => {
    const img = new Image();
    img.src = imageSrc;
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Update URL without page reload
      history.pushState(null, null, targetId);
      
      // Close mobile menu if open
      if (nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

// Keyboard accessibility for product cards
productCards.forEach(card => {
  card.setAttribute('tabindex', '0');
  
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const link = card.querySelector('a');
      if (link) link.click();
    }
  });
});

// Resize observer for responsive adjustments
if ('ResizeObserver' in window) {
  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      // Reset carousel position on resize
      currentPosition = 0;
      updateCarouselPosition();
    }
  });
  
  resizeObserver.observe(document.body);
}