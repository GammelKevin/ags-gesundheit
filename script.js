document.addEventListener('DOMContentLoaded', () => {
    // Theme Switch
    const themeSwitch = document.querySelector('.theme-switch');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    html.setAttribute('data-theme', savedTheme);
    
    themeSwitch.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Logo Intro Animation
    const logoIntro = document.querySelector('.logo-intro');
    const content = document.querySelector('.page-content');
    
    if (logoIntro) {
        // Show content initially
        if (content) {
            content.style.opacity = '1';
            content.style.visibility = 'visible';
        }
        
        // Fade out logo after delay
        setTimeout(() => {
            logoIntro.classList.add('fade-out');
            setTimeout(() => {
                logoIntro.remove();
            }, 500);
        }, 1500);
    }

    // Appointment Form
    const form = document.getElementById('appointmentForm');
    if (form) {
        const steps = document.querySelectorAll('.form-step');
        const progressBar = document.querySelector('.progress-bar');
        const stepDots = document.querySelectorAll('.step-dot');
        const stepLabels = document.querySelectorAll('.step-label');
        let currentStep = 1;

        // Update Progress
        const updateProgress = () => {
            // Calculate progress percentage
            const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
            
            // Animate progress bar
            progressBar.style.width = `${progress}%`;
            
            // Update dots and labels
            stepDots.forEach((dot, index) => {
                const step = index + 1;
                const label = stepLabels[index];
                
                // Reset classes
                dot.classList.remove('active', 'complete');
                label.classList.remove('active');
                
                // Set appropriate classes
                if (step === currentStep) {
                    dot.classList.add('active');
                    label.classList.add('active');
                } else if (step < currentStep) {
                    dot.classList.add('complete');
                }
            });
        };

        // Show Step with Animation
        const showStep = (step) => {
            const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
            const nextStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
            
            // Hide current step
            if (currentStepEl) {
                currentStepEl.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    currentStepEl.classList.remove('active');
                    currentStepEl.style.animation = '';
                }, 300);
            }
            
            // Show next step
            setTimeout(() => {
                if (nextStepEl) {
                    nextStepEl.classList.add('active');
                    nextStepEl.style.animation = 'fadeIn 0.5s ease forwards';
                }
            }, 300);
            
            // Update progress
            currentStep = step;
            updateProgress();
        };

        // Next Step with Validation
        const nextButtons = document.querySelectorAll('.next-btn');
        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                const step = button.closest('.form-step');
                const inputs = step.querySelectorAll('input[required], select[required], textarea[required]');
                let isValid = true;

                inputs.forEach(input => {
                    if (!input.value) {
                        isValid = false;
                        input.classList.add('is-invalid');
                        
                        // Add shake animation
                        input.style.animation = 'shake 0.5s ease';
                        setTimeout(() => {
                            input.style.animation = '';
                        }, 500);
                    } else {
                        input.classList.remove('is-invalid');
                    }
                });

                if (isValid) {
                    showStep(currentStep + 1);
                }
            });
        });

        // Previous Step
        const prevButtons = document.querySelectorAll('.prev-btn');
        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                showStep(currentStep - 1);
            });
        });

        // Form Submit with Loading State
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('.submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const spinner = submitBtn.querySelector('.spinner-border');
            
            // Disable button and show spinner
            submitBtn.disabled = true;
            btnText.style.opacity = '0';
            spinner.classList.remove('d-none');
            
            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success animation and message
                    const formContainer = form.closest('.appointment-form');
                    formContainer.style.animation = 'fadeOut 0.3s ease forwards';
                    
                    setTimeout(() => {
                        formContainer.innerHTML = `
                            <div class="text-center" style="animation: fadeIn 0.5s ease forwards;">
                                <i class="fas fa-check-circle text-success" style="font-size: 4rem;"></i>
                                <h3 class="mt-4">Vielen Dank!</h3>
                                <p>Ihre Terminanfrage wurde erfolgreich gesendet. Wir werden uns schnellstmöglich bei Ihnen melden.</p>
                                <a href="index.html" class="btn btn-primary mt-4">
                                    <i class="fas fa-home"></i> Zurück zur Startseite
                                </a>
                            </div>
                        `;
                    }, 300);
                } else {
                    throw new Error('Fehler beim Senden');
                }
            } catch (error) {
                // Error animation and message
                submitBtn.disabled = false;
                btnText.style.opacity = '1';
                spinner.classList.add('d-none');
                
                const errorDiv = document.createElement('div');
                errorDiv.className = 'alert alert-danger mt-3';
                errorDiv.textContent = 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.';
                errorDiv.style.animation = 'shake 0.5s ease';
                
                form.insertBefore(errorDiv, form.firstChild);
                
                setTimeout(() => {
                    errorDiv.style.animation = 'fadeOut 0.3s ease forwards';
                    setTimeout(() => {
                        errorDiv.remove();
                    }, 300);
                }, 5000);
            }
        });

        // Initialize first step
        updateProgress();
    }

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
