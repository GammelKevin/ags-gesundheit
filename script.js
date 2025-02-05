document.addEventListener('DOMContentLoaded', function() {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
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

    // Form validation and submission
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            // Validate form
            let isValid = true;
            const formInputs = this.querySelectorAll('input, select, textarea');
            
            formInputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value) {
                    isValid = false;
                    input.classList.add('is-invalid');
                } else {
                    input.classList.remove('is-invalid');
                }
            });

            if (!isValid) {
                e.preventDefault();
            } else {
                // Show loading state
                const submitButton = this.querySelector('button[type="submit"]');
                submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Wird gesendet...';
                submitButton.disabled = true;
            }
        });

        // Real-time validation
        appointmentForm.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value) {
                    this.classList.add('is-invalid');
                } else {
                    this.classList.remove('is-invalid');
                }
            });
        });
    }

    // Multi-Step Form Handling
    const form = document.getElementById('appointmentForm');
    const steps = form.querySelectorAll('.form-step');
    const progressBar = document.querySelector('.progress-bar');
    const totalSteps = steps.length;

    // Next Step Buttons
    form.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.form-step');
            const currentStepNum = parseInt(currentStep.dataset.step);
            
            // Validate current step
            const inputs = currentStep.querySelectorAll('input[required], select[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value) {
                    isValid = false;
                    input.classList.add('is-invalid');
                } else {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                }
            });

            if (isValid) {
                // Update progress bar
                const progress = (currentStepNum / totalSteps) * 100;
                progressBar.style.width = `${progress}%`;

                // Hide current step with animation
                currentStep.style.opacity = '0';
                currentStep.style.transform = 'translateX(-100px)';
                
                setTimeout(() => {
                    currentStep.classList.remove('active');
                    // Show next step with animation
                    const nextStep = form.querySelector(`[data-step="${currentStepNum + 1}"]`);
                    nextStep.classList.add('active');
                    setTimeout(() => {
                        nextStep.style.opacity = '1';
                        nextStep.style.transform = 'translateX(0)';
                    }, 50);
                }, 300);
            }
        });
    });

    // Previous Step Buttons
    form.querySelectorAll('.prev-step').forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.form-step');
            const currentStepNum = parseInt(currentStep.dataset.step);
            
            // Update progress bar
            const progress = ((currentStepNum - 2) / totalSteps) * 100;
            progressBar.style.width = `${progress}%`;

            // Hide current step with animation
            currentStep.style.opacity = '0';
            currentStep.style.transform = 'translateX(100px)';
            
            setTimeout(() => {
                currentStep.classList.remove('active');
                // Show previous step with animation
                const prevStep = form.querySelector(`[data-step="${currentStepNum - 1}"]`);
                prevStep.classList.add('active');
                setTimeout(() => {
                    prevStep.style.opacity = '1';
                    prevStep.style.transform = 'translateX(0)';
                }, 50);
            }, 300);
        });
    });

    // Form Submit
    form.addEventListener('submit', function(e) {
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.classList.add('loading');
        submitButton.innerHTML = 'Wird gesendet...';
        submitButton.disabled = true;
    });

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
