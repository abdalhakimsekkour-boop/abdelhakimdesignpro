// Floating animation for hero section creative elements (up/down only, no rotation)
function animateFloatingElements() {
  const floatItems = document.querySelectorAll('.float-icon');
  const now = performance.now();
  floatItems.forEach((el, i) => {
    // Each element gets a unique phase and amplitude for up/down motion
    const phase = i * 0.8;
    const amplitude = 28 + i * 8;
    const speed = 0.001 + i * 0.00025;
    const y = Math.sin(now * speed + phase) * amplitude;
    el.style.transform = `translateY(${y}px)`;
  });
  requestAnimationFrame(animateFloatingElements);
}

// Intersection Observer for gallery animations
function initGalleryAnimations() {
  const works = document.querySelectorAll('.project-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add staggered delay for each work item
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 150);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  works.forEach(work => {
    observer.observe(work);
  });
}

// --- LIGHTBOX DATA & LOGIC ---
const projects = {
  futurex: {
    title: "FUTUREX",
    description: "A futuristic brand identity and web design project focusing on VR and technology.",
    images: [
      "futurex_cover.png",
      "futurex_1.png",
      "futurex_2.png",
      "futurex_3.png",
      "futurex_4.jpg"
    ]
  },
  selected_works: {
    title: "Selected Works",
    description: "A collection of various design projects including SMD, Yassir, and ADMK Travels.",
    images: [
      "SMD.png",
      "yassir 22.png",
      "AIR1 yassir.png",
      "admkrtrevels.png"
    ]
  },
  design_works: {
    title: "Design Works",
    description: "A collection of graphic design projects including branding, product design, and promotional materials.",
    images: [
      "design_project_1.jpg",
      "design_project_2.jpg",
      "design_project_3.jpg",
      "design_project_4.jpg",
      "design_project_5.jpg"
    ]
  },
  savage_gym: {
    title: "Savage Gym",
    description: "Fitness and gym promotional campaign featuring motivational visuals and supplement marketing.",
    images: [
      "savage_gym_1.png",
      "savage_gym_2.png",
      "savage_gym_3.png",
      "savage_gym_4.jpg",
      "savage_gym_5.jpg"
    ]
  }
};

let currentProject = null;
let currentImageIndex = 0;

const modal = document.getElementById('lightbox-modal');
const modalImg = document.getElementById('lightbox-image');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const closeBtn = document.querySelector('.lightbox-close');
const prevBtn = document.querySelector('.prev-slide');
const nextBtn = document.querySelector('.next-slide');

function openModal(projectId) {
  if (!projects[projectId]) return;

  currentProject = projects[projectId];
  currentImageIndex = 0;

  updateModalContent();
  modal.classList.add('active');
  document.body.style.overflow = "hidden"; // Prevent scrolling
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = "auto"; // Restore scrolling
  currentProject = null;
}

function updateModalContent() {
  if (!currentProject) return;

  modalImg.src = currentProject.images[currentImageIndex];
  modalTitle.textContent = currentProject.title;
  modalDesc.textContent = currentProject.description;

  // Show/Hide navigation arrows if only 1 image
  if (currentProject.images.length > 1) {
    prevBtn.style.display = "block";
    nextBtn.style.display = "block";
  } else {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
  }
}

function nextImage() {
  if (!currentProject) return;
  currentImageIndex = (currentImageIndex + 1) % currentProject.images.length;
  updateModalContent();
}

function prevImage() {
  if (!currentProject) return;
  currentImageIndex = (currentImageIndex - 1 + currentProject.images.length) % currentProject.images.length;
  updateModalContent();
}

function initLightbox() {
  const workItems = document.querySelectorAll('.project-card');

  workItems.forEach(item => {
    item.addEventListener('click', () => {
      const projectId = item.getAttribute('data-project-id');
      openModal(projectId);
    });
  });

  closeBtn.addEventListener('click', closeModal);

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-content')) {
      // Only close if clicking the background, not the content wrapper itself (though content wrapper is usually full width/height in some designs, here it wraps content. 
      // Actually, clicking modal (the overlay) should close.
      if (e.target === modal) closeModal();
    }
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    nextImage();
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    prevImage();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('active')) {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    }
  });
}

// --- CONTACT FORM VALIDATION & HANDLING ---
function initContactForm() {
  const form = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');
  const submitBtn = form.querySelector('.submit-btn');
  
  // Form fields
  const fullNameInput = document.getElementById('full-name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const messageInput = document.getElementById('message');

  // Validation functions
  function validateFullName(value) {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'Full name is required';
    }
    if (trimmed.length < 2) {
      return 'Full name must be at least 2 characters';
    }
    if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
      return 'Full name can only contain letters, spaces, hyphens, and apostrophes';
    }
    return '';
  }

  function validateEmail(value) {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  function validatePhone(value) {
    if (!value.trim()) {
      return ''; // Optional field
    }
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(value)) {
      return 'Please enter a valid phone number';
    }
    return '';
  }

  function validateMessage(value) {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'Message is required';
    }
    if (trimmed.length < 10) {
      return 'Message must be at least 10 characters';
    }
    if (trimmed.length > 1000) {
      return 'Message must be less than 1000 characters';
    }
    return '';
  }

  function showFieldError(field, errorMessage) {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    formGroup.classList.add('has-error');
    if (errorElement) {
      errorElement.textContent = errorMessage;
      errorElement.classList.add('show');
      field.setAttribute('aria-invalid', 'true');
    }
  }

  function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    formGroup.classList.remove('has-error');
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('show');
      field.removeAttribute('aria-invalid');
    }
  }

  function showFormMessage(message, type = 'success') {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type} show`;
    formMessage.setAttribute('role', 'alert');
    
    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      formMessage.classList.remove('show');
      setTimeout(() => {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
      }, 400);
    }, 5000);
  }

  // Real-time validation on blur
  fullNameInput.addEventListener('blur', () => {
    const error = validateFullName(fullNameInput.value);
    if (error) {
      showFieldError(fullNameInput, error);
    } else {
      clearFieldError(fullNameInput);
    }
  });

  emailInput.addEventListener('blur', () => {
    const error = validateEmail(emailInput.value);
    if (error) {
      showFieldError(emailInput, error);
    } else {
      clearFieldError(emailInput);
    }
  });

  phoneInput.addEventListener('blur', () => {
    const error = validatePhone(phoneInput.value);
    if (error) {
      showFieldError(phoneInput, error);
    } else {
      clearFieldError(phoneInput);
    }
  });

  messageInput.addEventListener('blur', () => {
    const error = validateMessage(messageInput.value);
    if (error) {
      showFieldError(messageInput, error);
    } else {
      clearFieldError(messageInput);
    }
  });

  // Clear errors on input
  [fullNameInput, emailInput, phoneInput, messageInput].forEach(input => {
    input.addEventListener('input', () => {
      if (input.classList.contains('form-input:invalid')) {
        clearFieldError(input);
      }
    });
  });

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    formMessage.classList.remove('show');
    formMessage.textContent = '';
    
    // Validate all fields
    const nameError = validateFullName(fullNameInput.value);
    const emailError = validateEmail(emailInput.value);
    const phoneError = validatePhone(phoneInput.value);
    const messageError = validateMessage(messageInput.value);
    
    let hasErrors = false;
    
    if (nameError) {
      showFieldError(fullNameInput, nameError);
      hasErrors = true;
    } else {
      clearFieldError(fullNameInput);
    }
    
    if (emailError) {
      showFieldError(emailInput, emailError);
      hasErrors = true;
    } else {
      clearFieldError(emailInput);
    }
    
    if (phoneError) {
      showFieldError(phoneInput, phoneError);
      hasErrors = true;
    } else {
      clearFieldError(phoneInput);
    }
    
    if (messageError) {
      showFieldError(messageInput, messageError);
      hasErrors = true;
    } else {
      clearFieldError(messageInput);
    }
    
    if (hasErrors) {
      showFormMessage('Please correct the errors above', 'error');
      // Focus on first error
      const firstError = form.querySelector('.has-error .form-input');
      if (firstError) {
        firstError.focus();
      }
      return;
    }
    
    // Disable submit button and show loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    // Prepare form data
    const formData = {
      fullName: fullNameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim() || null,
      message: messageInput.value.trim()
    };
    
    try {
      // Simulate form submission (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real application, you would send the data to your server:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      // const result = await response.json();
      
      // For now, just log the data
      console.log('Form submitted:', formData);
      
      // Show success message
      showFormMessage('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
      
      // Reset form
      form.reset();
      
      // Clear all labels (since inputs are empty)
      [fullNameInput, emailInput, phoneInput, messageInput].forEach(input => {
        input.dispatchEvent(new Event('blur'));
      });
      
    } catch (error) {
      console.error('Form submission error:', error);
      showFormMessage('Something went wrong. Please try again later.', 'error');
    } finally {
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
    }
  });
}

// --- SCROLL ANIMATION FOR CONTACT SECTION ---
function initContactScrollAnimation() {
  const contactSection = document.querySelector('.contact-section');
  const contactWrapper = document.querySelector('.contact-wrapper');
  
  if (!contactSection || !contactWrapper) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        contactSection.classList.add('fade-in');
        setTimeout(() => {
          contactWrapper.classList.add('visible');
        }, 100);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  observer.observe(contactSection);
}

document.addEventListener('DOMContentLoaded', function () {
  // Initialize gallery animations
  initGalleryAnimations();

  // Start floating animations
  animateFloatingElements();

  // Initialize Lightbox
  initLightbox();
  
  // Initialize Contact Form
  initContactForm();
  
  // Initialize Contact Section Scroll Animation
  initContactScrollAnimation();
}); 
