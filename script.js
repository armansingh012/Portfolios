document.addEventListener('DOMContentLoaded', () => {
    // Store all social icon elements to make sure they stay visible
    const socialIcons = document.querySelectorAll('.social-icon');
    const footerSocialIcons = document.querySelectorAll('.footer-social .social-icon');
    
    // Initialize Locomotive Scroll with optimized settings
    const scroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        lerp: 0.05,  // Reduced from 0.08 for smoother scrolling
        multiplier: 0.7,  // Reduced from 0.9 for better control
        getDirection: true,
        smartphone: {
            smooth: false  // Disable smooth scroll on mobile for better performance
        },
        tablet: {
            smooth: true,
            breakpoint: 768
        },
        reloadOnContextChange: true,
        class: "is-inview",
        scrollFromAnywhere: true,
        touchMultiplier: 1.5,  // Reduced from 2 for more precise touch scrolling
        resetNativeScroll: false  // Changed to false to prevent conflicts
    });
    
    // Make scroll instance available globally
    window.locomotiveScroll = scroll;

    // Debounce function for performance optimization
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
    
    // Optimize scroll updates
    const updateScroll = debounce(() => {
        if (scroll) {
            scroll.update();
        }
    }, 150);

    // Handle scroll updates more efficiently
    window.addEventListener('resize', updateScroll);
    window.addEventListener('load', updateScroll);

    // Fix for smooth scrolling to sections
    document.querySelectorAll('a[href^="#"]:not([href="#about"]):not([href="#projects"]):not([href="#skills"]):not([href="#home"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Stop any ongoing scroll animations
                scroll.stop();
                
                // Scroll to target with optimized settings
                scroll.scrollTo(targetElement, {
                    offset: -100,
                    duration: 1000,
                    easing: [0.25, 0.00, 0.35, 1.00],  // Improved easing function
                    disableLerp: true  // Disable lerp during programmatic scroll
                });
            }
        });
    });

    // Add specific handler for home link
    document.querySelectorAll('a[href="#home"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close any open sections
            if (aboutSection.classList.contains('active')) {
                closeAboutSection();
            }
            if (projectsSection.classList.contains('active')) {
                closeProjectsSection();
            }
            if (skillsSection && skillsSection.classList.contains('active')) {
                closeSkillsSection();
            }
            
            // Scroll to top
            scroll.scrollTo('top', {
                duration: 1000,
                easing: [0.25, 0.00, 0.35, 1.00],
                disableLerp: true
            });
            
            // Update active nav link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Fix for section transitions
    const sections = document.querySelectorAll('[data-scroll-section]');
    sections.forEach(section => {
        section.setAttribute('data-scroll-section-inview', '');
    });

    // Handle scroll direction
    let lastScrollTop = 0;
    scroll.on('scroll', (args) => {
        const currentScrollTop = args.scroll.y;
        const direction = currentScrollTop > lastScrollTop ? 'down' : 'up';
        document.body.setAttribute('data-scroll-direction', direction);
        lastScrollTop = currentScrollTop;
    });

    // Prevent scroll chaining
    document.addEventListener('wheel', (e) => {
        if (document.body.classList.contains('modal-open')) {
            e.preventDefault();
        }
    }, { passive: false });

    // Mobile menu toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // About section toggle functionality
    const aboutLink = document.querySelector('a[href="#about"]');
    const aboutSection = document.getElementById('about');
    const bodyElement = document.body;
    
    // Make sure about section is hidden by default
    aboutSection.classList.remove('active');
    
    aboutLink.addEventListener('click', function(e) {
        e.preventDefault();
        openAboutSection();
    });
    
    // Projects section toggle functionality
    const projectsLink = document.querySelector('a[href="#projects"]');
    const projectsSection = document.getElementById('projects');
    
    // Make sure projects section is hidden by default
    projectsSection.classList.remove('active');
    
    projectsLink.addEventListener('click', function(e) {
        e.preventDefault();
        openProjectsSection();
    });
    
    // Function to open the about section
    function openAboutSection() {
        // Toggle active class on about section
        aboutSection.classList.add('active');
        
        // Reset about section scroll position to top
        aboutSection.scrollTop = 0;
        
        // Update active nav link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
        aboutLink.classList.add('active');
        
        // Disable scroll on main content when about is open
        bodyElement.style.overflow = 'hidden';
        
        // Trigger tab animations
        animateAboutContent();
        
        // Update locomotive scroll
        setTimeout(() => {
            scroll.update();
            scroll.stop(); // Pause locomotive scroll while in about section
        }, 400);
    }
    
    // Function to close the about section
    function closeAboutSection() {
        // First hide the content with animation
        const header = aboutSection.querySelector('.section-header');
        const aboutElements = aboutSection.querySelectorAll('.about-text > *, .certificates-container > *');
        
        // Fade out content first
        header.style.opacity = 0;
        header.style.transform = 'translateY(20px)';
        
        aboutElements.forEach(el => {
            el.style.opacity = 0;
            el.style.transform = 'translateY(20px)';
        });
        
        // After content fade-out, hide the section
        setTimeout(() => {
            aboutSection.classList.remove('active');
            bodyElement.style.overflow = '';
            
            // Update active nav link to home
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            document.querySelector('a[href="#home"]').classList.add('active');
            
            // Update and restart locomotive scroll
            setTimeout(() => {
                scroll.update();
                scroll.start();
            }, 50);
        }, 300);
    }
    
    // Function to open the projects section
    function openProjectsSection() {
        // Close about section if it's open
        if (aboutSection.classList.contains('active')) {
            closeAboutSection();
        }
        
        // Hide main content by adding a class to body
        bodyElement.classList.add('projects-open');
        
        // Make sure closeProjectsBtn is visible
        const closeProjectsBtn = document.querySelector('.close-projects-btn');
        if (closeProjectsBtn) {
            closeProjectsBtn.style.display = 'flex';
        }
        
        // Make sure GitHub projects button is visible
        const projectsCta = document.querySelector('.projects-cta');
        if (projectsCta) {
            projectsCta.style.opacity = '1';
            projectsCta.style.visibility = 'visible';
            projectsCta.style.display = 'block';
        }
        
        // Toggle active class on projects section
        projectsSection.classList.add('active');
        
        // Reset projects section scroll position to top
        projectsSection.scrollTop = 0;
        
        // Update active nav link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
        projectsLink.classList.add('active');
        
        // Disable scroll on main content when projects is open
        bodyElement.style.overflow = 'hidden';
        
        // Ensure the section is visible
        projectsSection.style.visibility = 'visible';
        
        // Force a reflow to ensure animations trigger properly
        void projectsSection.offsetWidth;
        
        // Update locomotive scroll
        setTimeout(() => {
            scroll.update();
            scroll.stop(); // Pause locomotive scroll while in projects section
        }, 600); // Increased timeout to match new animation duration
    }
    
    // Function to close the projects section
    function closeProjectsSection() {
        // Prevent multiple closing attempts
        if (projectsSection.classList.contains('closing')) {
            return;
        }

        // Add closing class for animation
        projectsSection.classList.add('closing');
        
        // Remove the projects-open class to show main content again
        bodyElement.classList.remove('projects-open');
        
        // Re-enable body scrolling
        bodyElement.style.overflow = '';
        
        // Update active nav link to home
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector('a[href="#home"]').classList.add('active');
        
        // After animation completes, reset the section completely
        setTimeout(() => {
            // Reset any open modals
            document.querySelectorAll('.project-details-modal.active').forEach(modal => {
                modal.classList.remove('active');
            });

            projectsSection.classList.remove('active', 'closing');
            projectsSection.style.visibility = 'hidden';
            
            // Update and restart locomotive scroll after a small delay to ensure DOM updates
            setTimeout(() => {
                scroll.update();
                scroll.start();
            }, 50);
        }, 600); // Match the new transition time
    }
    
    // Add a close button to about section
    const closeBtn = document.createElement('button');
    closeBtn.classList.add('close-about-btn');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    aboutSection.querySelector('.container').prepend(closeBtn);
    
    closeBtn.addEventListener('click', closeAboutSection);

    // Add a close button to projects section
    const closeProjectsBtn = document.createElement('button');
    closeProjectsBtn.classList.add('close-projects-btn');
    closeProjectsBtn.innerHTML = '<i class="fas fa-times"></i>';
    
    // Get the container and ensure we're appending as the first child
    const projectsContainer = projectsSection.querySelector('.container');
    if (projectsContainer.firstChild) {
        projectsContainer.insertBefore(closeProjectsBtn, projectsContainer.firstChild);
    } else {
        projectsContainer.appendChild(closeProjectsBtn);
    }
    
    closeProjectsBtn.addEventListener('click', closeProjectsSection);

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
        
        // Update locomotive scroll when changing theme
        scroll.update();
    });

    // Animate elements on scroll
    const animateOnScroll = () => {
        const animateElements = document.querySelectorAll('.hero-text > *');
        animateElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animated');
            }, 200 * index);
        });
    };
    
    // Animate about content
    const animateAboutContent = () => {
        const header = aboutSection.querySelector('.section-header');
        const aboutElements = aboutSection.querySelectorAll('.about-text > *, .certificates-container > *');
        
        // Reset animations first
        header.style.opacity = 0;
        header.style.transform = 'translateY(20px)';
        
        aboutElements.forEach(el => {
            el.style.opacity = 0;
            el.style.transform = 'translateY(20px)';
        });
        
        // Animate header first
        setTimeout(() => {
            header.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            header.style.opacity = 1;
            header.style.transform = 'translateY(0)';
        }, 100);
        
        // Then animate content elements with staggered delay
        aboutElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                element.style.opacity = 1;
                element.style.transform = 'translateY(0)';
            }, 300 + (100 * index));
        });
    };

    // Trigger animations after a short delay when page loads
    setTimeout(animateOnScroll, 500);

    // About section tabs functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to current button and content
                button.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    // Certificate cards hover effects
    const certificateCards = document.querySelectorAll('.certificate-card');
    
    certificateCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Add footer animations
    const footerSection = document.querySelector('.footer-section');
    const footerElements = document.querySelectorAll('.footer-content > *, .footer-social, .footer-bottom');
    
    // Track animation state to prevent repeated animations
    let footerAnimated = false;

    function animateFooterElements() {
        // Only animate if not already animated
        if (footerAnimated) return;
        
        footerElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                // Use requestAnimationFrame for smoother transitions
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, 50);
                });
            }, index * 120);
        });
        
        // Mark as animated to prevent repetition
        footerAnimated = true;
    }
    
    // Initialize footer element styles only once
    footerElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
    });

    // Use a more efficient approach for scroll detection
    let footerAnimationTriggered = false;
    scroll.on('scroll', (instance) => {
        if (footerAnimationTriggered) return;
        
        const footerRect = footerSection.getBoundingClientRect();
        const threshold = window.innerHeight * 0.8; // Trigger when 80% of viewport height reached
        
        if (footerRect.top < threshold) {
            animateFooterElements();
            footerAnimationTriggered = true;
            
            // Remove the scroll listener after animation is triggered
            scroll.off('scroll', animateFooterElements);
        }
    });

    // Call once on initial load with a slight delay
    setTimeout(() => {
        const footerRect = footerSection.getBoundingClientRect();
        if (footerRect.top < window.innerHeight) {
            animateFooterElements();
            footerAnimationTriggered = true;
        }
    }, 700);

    // Handle the footer About link
    const footerAboutLink = document.getElementById('footer-about-link');
    if (footerAboutLink) {
        footerAboutLink.addEventListener('click', function(e) {
            e.preventDefault();
            openAboutSection();
        });
    }

    // Handle the footer Projects link
    const footerProjectsLink = document.getElementById('footer-projects-link');
    if (footerProjectsLink) {
        footerProjectsLink.addEventListener('click', function(e) {
            e.preventDefault();
            openProjectsSection();
        });
    }

    // Handle the footer Skills link
    const footerSkillsLink = document.getElementById('footer-skills-link');
    if (footerSkillsLink) {
        footerSkillsLink.addEventListener('click', function(e) {
            e.preventDefault();
            openSkillsSection();
        });
    }
    
    // Handle the footer Home link
    const footerHomeLink = document.getElementById('footer-home-link');
    if (footerHomeLink) {
        footerHomeLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close any open sections
            if (aboutSection.classList.contains('active')) {
                closeAboutSection();
            }
            if (projectsSection.classList.contains('active')) {
                closeProjectsSection();
            }
            if (skillsSection && skillsSection.classList.contains('active')) {
                closeSkillsSection();
            }
            
            // Scroll to top
            scroll.scrollTo('top', {
                duration: 1000,
                easing: [0.25, 0.00, 0.35, 1.00],
                disableLerp: true
            });
            
            // Update active nav link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            document.querySelector('a[href="#home"]').classList.add('active');
        });
    }

    // Projects section functionality
    const setupProjectsSection = () => {
        const projectCards = document.querySelectorAll('.project-card');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const detailButtons = document.querySelectorAll('.project-details-btn');
        const closeModalButtons = document.querySelectorAll('.close-modal');
        
        // Handle image loading errors
        const handleImageError = (img) => {
            img.classList.add('error');
            img.style.opacity = '0';
        };

        // Setup image error handlers
        document.querySelectorAll('.project-img img, .modal-img img').forEach(img => {
            img.addEventListener('error', () => handleImageError(img));
            // Check if image is already in error state
            if (!img.complete || img.naturalWidth === 0) {
                handleImageError(img);
            }
        });
        
        // Filter functionality
        if (filterButtons.length) {
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Remove active class from all buttons
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    
                    // Add active class to clicked button
                    button.classList.add('active');
                    
                    const filterValue = button.getAttribute('data-filter');
                    
                    // Make sure the CTA button is always visible
                    const projectsCta = document.querySelector('.projects-cta');
                    if (projectsCta) {
                        projectsCta.style.opacity = '1';
                        projectsCta.style.visibility = 'visible';
                    }
                    
                    // Show/hide projects based on filter
                    projectCards.forEach(card => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            const categories = card.getAttribute('data-category');
                            if (filterValue === 'all' || categories.includes(filterValue)) {
                                card.style.display = 'block';
                                // Trigger reflow
                                void card.offsetWidth;
                                // Show with animation
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            } else {
                                card.style.display = 'none';
                            }
                        }, 300);
                    });
                });
            });
        }
        
        // Modal functionality
        detailButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent event bubbling
                const modal = button.closest('.project-card').querySelector('.project-details-modal');
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        closeModalButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent event bubbling
                const modal = button.closest('.project-details-modal');
                if (modal) {
                    modal.classList.remove('active');
                    // Only restore scroll if projects section is not active
                    if (!projectsSection.classList.contains('active')) {
                        document.body.style.overflow = '';
                    }
                }
            });
        });
        
        // Close modal on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('project-details-modal')) {
                e.target.classList.remove('active');
                // Only restore scroll if projects section is not active
                if (!projectsSection.classList.contains('active')) {
                    document.body.style.overflow = '';
                }
            }
        });
    };
    
    // Initialize projects section after a short delay
    setTimeout(setupProjectsSection, 800);

    // Handle hero CTA button for Projects
    const heroProjectsBtn = document.getElementById('hero-projects-btn');
    if (heroProjectsBtn) {
        heroProjectsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openProjectsSection();
        });
    }

    // Skills section toggle functionality
    const skillsLink = document.querySelector('a[href="#skills"]');
    const skillsSection = document.getElementById('skills');

    // Make sure skills section is hidden by default
    skillsSection.classList.remove('active');

    skillsLink.addEventListener('click', function(e) {
        e.preventDefault();
        openSkillsSection();
    });

    // Function to open the skills section
    function openSkillsSection() {
        // Close about section if it's open
        if (aboutSection.classList.contains('active')) {
            closeAboutSection();
        }
        
        // Close projects section if it's open
        if (projectsSection.classList.contains('active')) {
            closeProjectsSection();
        }
        
        // Hide main content by adding a class to body
        bodyElement.classList.add('skills-open');
        
        // Toggle active class on skills section
        skillsSection.classList.add('active');
        
        // Reset skills section scroll position to top
        skillsSection.scrollTop = 0;
        
        // Update active nav link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
        skillsLink.classList.add('active');
        
        // Disable scroll on main content when skills is open
        bodyElement.style.overflow = 'hidden';
        
        // Ensure the section is visible
        skillsSection.style.visibility = 'visible';
        
        // Force a reflow to ensure animations trigger properly
        void skillsSection.offsetWidth;
        
        // Update locomotive scroll
        setTimeout(() => {
            scroll.update();
            scroll.stop(); // Pause locomotive scroll while in skills section
        }, 600);
    }

    // Function to close the skills section
    function closeSkillsSection() {
        // Prevent multiple closing attempts
        if (skillsSection.classList.contains('closing')) {
            return;
        }

        // Add closing class for animation
        skillsSection.classList.add('closing');
        
        // Remove the skills-open class to show main content again
        bodyElement.classList.remove('skills-open');
        
        // Re-enable body scrolling
        bodyElement.style.overflow = '';
        
        // Update active nav link to home
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector('a[href="#home"]').classList.add('active');
        
        // After animation completes, reset the section completely
        setTimeout(() => {
            // Reset any open modals
            document.querySelectorAll('.skill-details-modal.active').forEach(modal => {
                modal.classList.remove('active');
            });

            skillsSection.classList.remove('active', 'closing');
            skillsSection.style.visibility = 'hidden';
            
            // Update and restart locomotive scroll after a small delay to ensure DOM updates
            setTimeout(() => {
                scroll.update();
                scroll.start();
            }, 50);
        }, 600);
    }

    // Add a close button to skills section
    const closeSkillsBtn = document.createElement('button');
    closeSkillsBtn.classList.add('close-skills-btn');
    closeSkillsBtn.innerHTML = '<i class="fas fa-times"></i>';
    
    // Get the container and ensure we're appending as the first child
    const skillsContainer = skillsSection.querySelector('.container');
    if (skillsContainer.firstChild) {
        skillsContainer.insertBefore(closeSkillsBtn, skillsContainer.firstChild);
    } else {
        skillsContainer.appendChild(closeSkillsBtn);
    }

    closeSkillsBtn.addEventListener('click', closeSkillsSection);

    // Skills section functionality
    const setupSkillsSection = () => {
        const skillCards = document.querySelectorAll('.skill-card');
        const filterButtons = document.querySelectorAll('.skills-filter .filter-btn');
        const skillsGrid = document.querySelector('.skills-grid');
        const skillModals = document.querySelectorAll('.skill-details-modal');
        const modalCloseButtons = document.querySelectorAll('.skill-details-modal .close-modal');
        const detailButtons = document.querySelectorAll('.skill-details-btn');

        // Intersection Observer for skill cards - use this when skills section is open
        const observerOptions = {
            root: skillsSection,
            rootMargin: '0px',
            threshold: 0.1
        };

        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Add skill animation when section becomes active
        const addVisibilityToCards = () => {
            skillCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, 100 * index);
            });
        };

        // When skills section becomes active, animate the cards
        const skillsSectionObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    if (skillsSection.classList.contains('active')) {
                        setTimeout(addVisibilityToCards, 300);
                        
                        // Observe each skill card
                        skillCards.forEach(card => {
                            skillObserver.observe(card);
                        });
                    } else {
                        // When section is closed, reset visibility
                        skillCards.forEach(card => {
                            card.classList.remove('visible');
                            skillObserver.unobserve(card);
                        });
                    }
                }
            });
        });

        // Observe changes to the skills section's class
        skillsSectionObserver.observe(skillsSection, { attributes: true });

        // Filter functionality
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                
                // Add filtering class for animation
                skillsGrid.classList.add('filtering');
                
                setTimeout(() => {
                    // Show/hide skills based on filter
                    skillCards.forEach(card => {
                        const categories = card.getAttribute('data-category');
                        
                        if (filterValue === 'all' || categories === filterValue) {
                            card.style.display = 'flex';
                            // Force reflow
                            void card.offsetWidth;
                            // Add visible class for animation
                            card.classList.add('visible');
                        } else {
                            card.style.display = 'none';
                            card.classList.remove('visible');
                        }
                    });
                    
                    // Remove filtering class
                    skillsGrid.classList.remove('filtering');
                }, 300);
            });
        });

        // Modal functionality
        detailButtons.forEach((button, index) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent event bubbling
                skillModals[index].classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        modalCloseButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent event bubbling
                button.closest('.skill-details-modal').classList.remove('active');
                // Only restore scroll if we're already in the skills section
                if (skillsSection.classList.contains('active')) {
                    document.body.style.overflow = 'hidden'; // Keep main scroll disabled
                } else {
                    document.body.style.overflow = '';
                }
            });
        });

        // Close modal when clicking outside
        skillModals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    e.stopPropagation(); // Prevent event bubbling
                    modal.classList.remove('active');
                    // Only restore scroll if we're already in the skills section
                    if (skillsSection.classList.contains('active')) {
                        document.body.style.overflow = 'hidden'; // Keep main scroll disabled
                    } else {
                        document.body.style.overflow = '';
                    }
                }
            });
        });

        // Handle image loading errors
        const skillImages = document.querySelectorAll('.skill-img img');
        skillImages.forEach(img => {
            img.addEventListener('error', () => {
                img.src = '';  // This will trigger the fallback
            });
        });
    };

    // Initialize skills section
    setTimeout(setupSkillsSection, 800);

    // Add footer newsletter functionality
    const setupFooterFunctionality = () => {
        try {
            // Add newsletter form functionality
            const newsletterForm = document.querySelector('.newsletter-form');
            if (newsletterForm) {
                newsletterForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const emailInput = this.querySelector('input[type="email"]');
                    
                    if (emailInput && emailInput.value) {
                        // Validate email
                        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailPattern.test(emailInput.value)) {
                            showNotification('Please enter a valid email address', 'error');
                            return;
                        }
                        
                        // Here you would normally send to a server
                        // For now, we'll just show a success message
                        showNotification('Thank you for subscribing!', 'success');
                        emailInput.value = '';
                    } else {
                        showNotification('Please enter your email address', 'error');
                    }
                });
            }
            
            // Handle all footer links with improved targeting
            document.querySelectorAll('.footer-links a, .footer-bottom-links a').forEach(link => {
                link.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    
                    // Skip external links
                    if (href && (href.startsWith('http') || href.startsWith('mailto:'))) {
                        return; // Let the browser handle these
                    }
                    
                    e.preventDefault();
                    
                    // Handle section toggles with improved reliability
                    if (href === '#about') {
                        openAboutSection();
                    } else if (href === '#projects') {
                        openProjectsSection();
                    } else if (href === '#skills') {
                        openSkillsSection();
                    } else if (href === '#home') {
                        // Close any open sections
                        if (aboutSection.classList.contains('active')) {
                            closeAboutSection();
                        }
                        if (projectsSection.classList.contains('active')) {
                            closeProjectsSection();
                        }
                        if (skillsSection && skillsSection.classList.contains('active')) {
                            closeSkillsSection();
                        }
                        
                        // Scroll to top
                        scroll.scrollTo('top', {
                            duration: 1000,
                            easing: [0.25, 0.00, 0.35, 1.00],
                            disableLerp: true
                        });
                        
                        // Update active nav link
                        document.querySelectorAll('.nav-links a').forEach(link => {
                            link.classList.remove('active');
                        });
                        document.querySelector('a[href="#home"]').classList.add('active');
                    } else if (href === '#') {
                        // Handle placeholder links
                        showNotification('This feature is coming soon!', 'info');
                    }
                });
            });
            
            // Make contact info links functional
            const contactEmail = document.querySelector('.contact-info li:nth-child(1)');
            if (contactEmail) {
                contactEmail.style.cursor = 'pointer';
                contactEmail.addEventListener('click', function() {
                    const email = this.textContent.trim();
                    window.location.href = `mailto:${email}`;
                });
            }
            
            const contactPhone = document.querySelector('.contact-info li:nth-child(2)');
            if (contactPhone) {
                contactPhone.style.cursor = 'pointer';
                contactPhone.addEventListener('click', function() {
                    const phone = this.textContent.trim().replace(/\s+/g, '');
                    window.location.href = `tel:${phone}`;
                });
            }
            
            const contactLocation = document.querySelector('.contact-info li:nth-child(3)');
            if (contactLocation) {
                contactLocation.style.cursor = 'pointer';
                contactLocation.addEventListener('click', function() {
                    const location = this.textContent.trim();
                    window.open(`https://maps.google.com?q=${encodeURIComponent(location)}`, '_blank');
                });
            }
            
            // Ensure social links have proper attributes
            document.querySelectorAll('.footer-social .social-icon').forEach(icon => {
                const link = icon.getAttribute('href');
                if (link && link !== '#') {
                    if (!icon.hasAttribute('target')) {
                        icon.setAttribute('target', '_blank');
                    }
                    if (!icon.hasAttribute('rel')) {
                        icon.setAttribute('rel', 'noopener');
                    }
                } else {
                    // Add click handler for placeholder links
                    icon.addEventListener('click', function(e) {
                        e.preventDefault();
                        showNotification('Social profile coming soon!', 'info');
                    });
                }
            });
            
            // Year dynamic update
            const copyrightYear = document.querySelector('.footer-bottom p');
            if (copyrightYear) {
                const currentYear = new Date().getFullYear();
                copyrightYear.innerHTML = copyrightYear.innerHTML.replace(/\d{4}/, currentYear);
            }
            
        } catch (error) {
            console.error('Error setting up footer functionality:', error);
        }
    };

    // Create a notification system
    function showNotification(message, type = 'info') {
        // Check if notification container exists, if not create it
        let notificationContainer = document.querySelector('.notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .notification-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 10000;
                }
                .notification {
                    background-color: var(--card-bg);
                    color: var(--text-color);
                    padding: 12px 20px;
                    border-radius: 8px;
                    margin-top: 10px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    transform: translateX(120%);
                    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .notification.show {
                    transform: translateX(0);
                }
                .notification.success {
                    border-left: 4px solid #4CAF50;
                }
                .notification.error {
                    border-left: 4px solid #F44336;
                }
                .notification.info {
                    border-left: 4px solid #2196F3;
                }
                .notification i {
                    font-size: 1.2rem;
                }
                .notification.success i {
                    color: #4CAF50;
                }
                .notification.error i {
                    color: #F44336;
                }
                .notification.info i {
                    color: #2196F3;
                }
                .dark-theme .notification {
                    background-color: #2a2a2a;
                    color: #fff;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                }
            `;
            document.head.appendChild(style);
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Add icon based on type
        let icon = '';
        switch (type) {
            case 'success':
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'error':
                icon = '<i class="fas fa-exclamation-circle"></i>';
                break;
            default:
                icon = '<i class="fas fa-info-circle"></i>';
        }
        
        notification.innerHTML = `${icon}<span>${message}</span>`;
        notificationContainer.appendChild(notification);
        
        // Show notification with slight delay
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove notification after timeout
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 400); // Match transition time
        }, 4000);
    }

    // Initialize footer functionality
    setTimeout(setupFooterFunctionality, 1000);
}); 