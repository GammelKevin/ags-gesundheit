document.addEventListener('DOMContentLoaded', function() {
    // Form Steps
    const form = document.getElementById('appointmentForm');
    const steps = document.querySelectorAll('.form-step');
    const progressBar = document.querySelector('.progress-bar');
    const stepDots = document.querySelectorAll('.step-dot');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    let currentStep = 1;

    // Logo Intro Animation
    const logoIntro = document.querySelector('.logo-intro');
    const pageContent = document.querySelector('.page-content');
    const themeSwitch = document.querySelector('.theme-switch');
    
    if (logoIntro && pageContent) {
        const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
        
        if (!hasSeenIntro) {
            // Initial state
            pageContent.style.opacity = '0';
            pageContent.style.transform = 'translateY(20px)';
            
            // Show logo intro
            setTimeout(() => {
                logoIntro.classList.add('active');
            }, 300);
            
            // Hide logo intro and show content
            setTimeout(() => {
                logoIntro.classList.add('fade-out');
                pageContent.style.opacity = '1';
                pageContent.style.transform = 'translateY(0)';
            }, 2000);
            
            // Remove logo intro from DOM after animation
            setTimeout(() => {
                logoIntro.style.display = 'none';
            }, 3000);
            
            // Mark that user has seen intro
            sessionStorage.setItem('hasSeenIntro', 'true');
        } else {
            // Skip intro if already seen
            logoIntro.style.display = 'none';
            pageContent.style.opacity = '1';
            pageContent.style.transform = 'translateY(0)';
        }
    }

    // Theme Switch
    if (themeSwitch) {
        themeSwitch.addEventListener('click', () => {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            themeSwitch.classList.toggle('light');
            
            // Save theme preference
            localStorage.setItem('theme', newTheme);
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            if (savedTheme === 'light') {
                themeSwitch.classList.add('light');
            }
        }
    }

    // Form functionality
    if (form) {
        // Update Progress Bar and Step Dots
        function updateProgress() {
            const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
            progressBar.style.width = `${progress}%`;
            
            // Update step dots
            stepDots.forEach((dot, index) => {
                if (index + 1 < currentStep) {
                    dot.classList.add('active');
                    dot.style.backgroundColor = 'var(--success-color)';
                } else if (index + 1 === currentStep) {
                    dot.classList.add('active');
                    dot.style.backgroundColor = 'var(--primary-color)';
                } else {
                    dot.classList.remove('active');
                    dot.style.backgroundColor = '';
                }
            });
        }

        // Show Step with Animation
        function showStep(stepNumber) {
            const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
            const nextStepElement = document.querySelector(`[data-step="${stepNumber}"]`);
            
            // Hide current step
            if (currentStepElement) {
                currentStepElement.style.opacity = '0';
                currentStepElement.style.transform = stepNumber > currentStep ? 
                    'translateX(-50px) scale(0.95)' : 'translateX(50px) scale(0.95)';
                
                setTimeout(() => {
                    currentStepElement.classList.remove('active');
                    
                    // Show next step
                    nextStepElement.classList.add('active');
                    setTimeout(() => {
                        nextStepElement.style.opacity = '1';
                        nextStepElement.style.transform = 'translateX(0) scale(1)';
                    }, 50);
                }, 300);
            } else {
                nextStepElement.classList.add('active');
                nextStepElement.style.opacity = '1';
                nextStepElement.style.transform = 'translateX(0) scale(1)';
            }
            
            currentStep = stepNumber;
            updateProgress();
        }

        // Validate Current Step
        function validateStep(stepNumber) {
            const currentStepElement = document.querySelector(`[data-step="${stepNumber}"]`);
            const requiredFields = currentStepElement.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value) {
                    isValid = false;
                    field.classList.add('is-invalid');
                    field.classList.remove('is-valid');
                    
                    // Shake animation for invalid fields
                    field.style.animation = 'none';
                    field.offsetHeight; // Trigger reflow
                    field.style.animation = 'shake 0.5s ease-in-out';
                } else {
                    field.classList.remove('is-invalid');
                    field.classList.add('is-valid');
                }
            });

            return isValid;
        }

        // Next/Previous buttons
        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (validateStep(currentStep)) {
                    // Add success animation to the current step dot
                    const currentDot = document.querySelector(`.step-dot[data-step="${currentStep}"]`);
                    currentDot.style.animation = 'successPop 0.5s ease-out';
                    
                    // Proceed to next step
                    showStep(currentStep + 1);
                }
            });
        });

        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                showStep(currentStep - 1);
            });
        });

        // Initialize first step
        showStep(1);
    }

    // Date Input Validation
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.setAttribute('min', tomorrow.toISOString().split('T')[0]);
    }

    // Add shake animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(style);

    // Form Field Validation on Input
    const formInputs = form.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.hasAttribute('required')) {
                if (!input.value) {
                    input.classList.add('is-invalid');
                    input.classList.remove('is-valid');
                } else {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                }
            }
        });
    });

    // Form Submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateStep(currentStep)) {
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wird gesendet...';
            submitButton.disabled = true;

            // Submit form
            const formData = new FormData(form);
            fetch(form.action, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    // Success animation before redirect
                    submitButton.innerHTML = '<i class="fas fa-check"></i> Erfolgreich gesendet!';
                    submitButton.classList.remove('btn-primary');
                    submitButton.classList.add('btn-success');
                    
                    setTimeout(() => {
                        window.location.href = 'danke.html';
                    }, 1000);
                } else {
                    throw new Error('Fehler beim Senden');
                }
            })
            .catch(error => {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                alert('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.');
            });
        }
    });

    // Smooth Scrolling for Navigation Links
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

    // Navbar Background Change on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '0.5rem 0';
        } else {
            navbar.style.padding = '1rem 0';
        }
    });

    // Navbar Scroll Effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Scroll Reveal Animation
    const scrollReveal = function() {
        const elements = document.querySelectorAll('.service-card, .about-image, .contact-card, .appointment-form');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial style for animation elements
    document.querySelectorAll('.service-card, .about-image, .contact-card, .appointment-form').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease-out';
    });

    // Call scrollReveal on load and scroll
    scrollReveal();
    window.addEventListener('scroll', scrollReveal);

    // Service card hover effect
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
            this.style.boxShadow = '0 20px 30px rgba(0,0,0,0.1)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
        });
    });

    // Mobile menu closing after click
    document.querySelector('.navbar-nav').addEventListener('click', function(e) {
        if (e.target.classList.contains('nav-link')) {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        }
    });
});
