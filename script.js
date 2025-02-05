document.addEventListener('DOMContentLoaded', function() {
    // Theme Switch
    const themeSwitch = document.querySelector('.theme-switch');
    const html = document.documentElement;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    }

    themeSwitch.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Multi-step Form
    const prevBtns = document.querySelectorAll('.prev-btn');
    const nextBtns = document.querySelectorAll('.next-btn');
    const progress = document.getElementById('progress');
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');

    let formStepsNum = 0;

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(formStepsNum)) {
                formStepsNum++;
                updateFormSteps();
                updateProgressbar();
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            formStepsNum--;
            updateFormSteps();
            updateProgressbar();
        });
    });

    function updateFormSteps() {
        formSteps.forEach(formStep => {
            formStep.classList.contains('active') && formStep.classList.remove('active');
        });

        formSteps[formStepsNum].classList.add('active');
    }

    function updateProgressbar() {
        progressSteps.forEach((progressStep, idx) => {
            if (idx < formStepsNum + 1) {
                progressStep.classList.add('active');
                progressStep.classList.add('complete');
            } else {
                progressStep.classList.remove('active');
                progressStep.classList.remove('complete');
            }
        });

        const progressActive = document.querySelectorAll('.progress-step.active');

        progress.style.width = ((progressActive.length - 1) / (progressSteps.length - 1)) * 100 + '%';
    }

    function validateStep(step) {
        const currentStep = formSteps[step];
        const inputs = currentStep.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value) {
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                input.classList.remove('is-invalid');
            }
        });

        return isValid;
    }

    // Form Submission Animation
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = appointmentForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wird gesendet...';

            try {
                const formData = new FormData(appointmentForm);
                const response = await fetch(appointmentForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Gesendet!';
                    submitBtn.classList.remove('btn-primary');
                    submitBtn.classList.add('btn-success');
                    
                    // Redirect after 2 seconds
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                } else {
                    throw new Error('Netzwerkfehler');
                }
            } catch (error) {
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Fehler';
                submitBtn.classList.remove('btn-primary');
                submitBtn.classList.add('btn-danger');
                submitBtn.disabled = false;
            }
        });
    }

    // Logo Intro Animation
    const logoIntro = document.querySelector('.logo-intro');
    const pageContent = document.querySelector('.page-content');
    
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
    const formInputs = document.querySelectorAll('input, select, textarea');
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
