document.addEventListener('DOMContentLoaded', () => {

    /* --- NEW CIRCULAR SVG LOADER LOGIC --- */
    const loaderOverlay = document.getElementById('loader');
    const loaderPercent = document.getElementById('loader-percent');
    const progressActive = document.getElementById('progress-active');
    const scrollContainer = document.getElementById('main-content');
    
    // Calculate circumference for strokeDashoffset
    const radius = progressActive.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    progressActive.style.strokeDashoffset = circumference;

    let count = 0;
    const duration = 2000; 
    const intervalTime = 20; 
    const increment = (100 / (duration / intervalTime));

    const counterInterval = setInterval(() => {
        count += increment;
        if (count >= 100) {
            count = 100;
            clearInterval(counterInterval);
            
            setTimeout(() => {
                loaderOverlay.classList.add('hidden');
                
                setTimeout(() => {
                    scrollContainer.classList.add('loaded');
                    sections[0].classList.add('is-active');
                    updateNavDots(0);
                }, 300);

            }, 400);
        }
        
        // Update text
        loaderPercent.textContent = Math.floor(count);
        
        // Update SVG circle stroke
        const offset = circumference - (count / 100) * circumference;
        progressActive.style.strokeDashoffset = offset;
        
    }, intervalTime);


    /* --- SCROLL INTEGRATION & TIMELINE --- */
    const sections = document.querySelectorAll('.snap-section');
    const navItems = document.querySelectorAll('.nav-item');
    const progressLine = document.querySelector('.nav-progress-line');

    function updateNavDots(index) {
        navItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        if (progressLine && navItems.length > 0 && navItems[index]) {
            const firstDot = navItems[0];
            const activeDot = navItems[index];
            if (window.innerWidth <= 768) {
                const width = activeDot.offsetLeft - firstDot.offsetLeft + (activeDot.offsetWidth / 2);
                progressLine.style.width = `${width}px`;
                progressLine.style.height = '2px';
            } else {
                const height = activeDot.offsetTop - firstDot.offsetTop + (activeDot.offsetHeight / 2);
                progressLine.style.height = `${height}px`;
                progressLine.style.width = '2px';
            }
        }
    }

    // Initialize first state
    updateNavDots(0);

    // Dynamic Parallax Scroll
    scrollContainer.addEventListener('scroll', () => {
        let currentIndex = 0;
        let minDiff = Infinity;
        sections.forEach((sec, idx) => {
            // Calculate absolute distance from section top to viewport top
            const diff = Math.abs(sec.getBoundingClientRect().top);
            if (diff < minDiff) {
                minDiff = diff;
                currentIndex = idx;
            }
        });
        
        sections.forEach((sec, idx) => {
            if (idx === Math.round(currentIndex)) {
                sec.classList.add('is-active');
            } else {
                sec.classList.remove('is-active');
            }
            
            // Fluid dissolve & parallax based on visibility intersection
            const rect = sec.getBoundingClientRect();
            const visibleHeight = Math.max(0, Math.min(window.innerHeight, rect.bottom) - Math.max(0, rect.top));
            const maxVisible = Math.min(rect.height, window.innerHeight);
            const visibilityRatio = maxVisible > 0 ? (visibleHeight / maxVisible) : 0;
            
            // Apply easing to exaggerate the dissolve effect
            const easedRatio = Math.pow(visibilityRatio, 2.5);
            
            // Parallax offset
            const centerOffset = (rect.top + rect.height/2) - window.innerHeight/2;
            
            // Remove blur on desktop, apply only on tablet/mobile (<= 1024px)
            const isMobileOrTab = window.innerWidth <= 1024;
            const blurValue = isMobileOrTab ? (1 - easedRatio) * 12 : 0;
            
            sec.style.opacity = easedRatio;
            sec.style.filter = `blur(${blurValue}px)`;
            sec.style.transform = `scale(${0.95 + (easedRatio * 0.05)}) translateY(${centerOffset * 0.05}px)`;
            
            // Make them truly disappear when gone
            if (easedRatio <= 0.01) {
                sec.style.pointerEvents = 'none';
                sec.style.visibility = 'hidden';
            } else {
                sec.style.pointerEvents = 'auto';
                sec.style.visibility = 'visible';
            }
        });

        updateNavDots(currentIndex);
    });

    // Handle clicks on side nav
    navItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            if (sections[index]) {
                scrollContainer.scrollTo({
                    top: sections[index].offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* --- CUSTOM CURSOR --- */
    const cursor = document.querySelector('.custom-cursor');
    const cursorFollower = document.querySelector('.custom-cursor-follower');
    
    if (cursor && cursorFollower) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let followerX = mouseX;
        let followerY = mouseY;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        });

        function animateFollower() {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        const elements = document.querySelectorAll('a, button, .nav-item, .skill-box, .work-row, .mouse, .about-card, .social-card');
        
        elements.forEach(el => {
            let isCard = el.classList.contains('social-card') || el.classList.contains('work-row') || el.classList.contains('skill-box') || el.classList.contains('about-card');
            
            el.addEventListener('mouseenter', () => {
                if (isCard) {
                    cursor.classList.add('hover-card');
                    cursorFollower.classList.add('hover-card');
                } else {
                    cursor.classList.add('hover');
                    cursorFollower.classList.add('hover');
                }
            });
            
            el.addEventListener('mouseleave', () => {
                if (isCard) {
                    cursor.classList.remove('hover-card');
                    cursorFollower.classList.remove('hover-card');
                } else {
                    cursor.classList.remove('hover');
                    cursorFollower.classList.remove('hover');
                }
            });
        });
    }

    /* --- SMOOTHER SCROLLING FOR WHEEL --- */
});
