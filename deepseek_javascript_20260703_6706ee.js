// ============================================================
//  NEXUS LANDING — MASTER SCRIPT (Fully debugged & robust)
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('✅ Nexus JS: DOM ready');

    // ----------------------------------------------------------
    // 1. PARTICLE NETWORK (background canvas)
    // ----------------------------------------------------------
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        const PARTICLE_COUNT = 70;
        const CONNECTION_DIST = 130;

        // Resize handler using getBoundingClientRect (bulletproof)
        function resizeCanvas() {
            const rect = canvas.parentElement.getBoundingClientRect();
            width = canvas.width = rect.width || window.innerWidth;
            height = canvas.height = rect.height || window.innerHeight;
            console.log(`📐 Canvas resized: ${width}×${height}`);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas(); // initial sizing

        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2.2 + 1.0;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(59, 130, 246, 0.25)';
                ctx.fill();
            }
        }

        // Create particles
        function initParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(new Particle());
            }
        }
        initParticles();

        // Draw connections
        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECTION_DIST) {
                        const alpha = 1 - dist / CONNECTION_DIST;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(59, 130, 246, ${alpha * 0.18})`;
                        ctx.lineWidth = 1.2;
                        ctx.stroke();
                    }
                }
            }
        }

        // Animation loop
        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach((p) => {
                p.update();
                p.draw();
            });
            drawLines();
            requestAnimationFrame(animateParticles);
        }

        animateParticles();

        // Rebuild particles on resize
        window.addEventListener('resize', function () {
            resizeCanvas();
            initParticles();
        });

        console.log('✨ Particles initialized');
    } else {
        console.warn('⚠️ #particleCanvas not found');
    }

    // ----------------------------------------------------------
    // 2. SCROLL REVEAL (fade-up)
    // ----------------------------------------------------------
    const fadeElements = document.querySelectorAll('.fade-up');
    if (fadeElements.length) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            {
                threshold: 0.15,
                rootMargin: '0px 0px -40px 0px',
            }
        );
        fadeElements.forEach((el) => revealObserver.observe(el));
        console.log(`👀 Watching ${fadeElements.length} fade-up elements`);
    }

    // ----------------------------------------------------------
    // 3. STAT COUNTERS (animate numbers)
    // ----------------------------------------------------------
    const counters = document.querySelectorAll('.stat-number');
    let countersTriggered = false;

    function animateCounter(el) {
        const target = parseFloat(el.dataset.target);
        if (isNaN(target)) return;
        const isDecimal = target % 1 !== 0;
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentValue = eased * target;
            el.textContent = isDecimal ? currentValue.toFixed(1) : Math.round(currentValue);
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = isDecimal ? target.toFixed(1) : target;
            }
        }
        requestAnimationFrame(updateCounter);
    }

    if (counters.length) {
        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            const statsObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting && !countersTriggered) {
                            countersTriggered = true;
                            counters.forEach((c) => animateCounter(c));
                            console.log('📊 Counters animated');
                        }
                    });
                },
                { threshold: 0.4 }
            );
            statsObserver.observe(statsSection);
        }
    }

    // ----------------------------------------------------------
    // 4. MOBILE HAMBURGER
    // ----------------------------------------------------------
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            const isOpen = navLinks.classList.toggle('open');
            this.setAttribute('aria-expanded', isOpen);
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
        console.log('🍔 Hamburger ready');
    }

    // ----------------------------------------------------------
    // 5. CTA FORM
    // ----------------------------------------------------------
    const ctaForm = document.getElementById('ctaForm');
    const formFeedback = document.getElementById('formFeedback');
    if (ctaForm && formFeedback) {
        ctaForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value.trim();
            if (email) {
                formFeedback.textContent = '✅ Thank you! Your free trial is on its way.';
                formFeedback.style.color = '#a5f3fc';
                this.reset();
                setTimeout(() => {
                    formFeedback.textContent = '';
                }, 6000);
                console.log('📧 Form submitted:', email);
            }
        });
    }

    // ----------------------------------------------------------
    // 6. SMOOTH SCROLL (for anchor links)
    // ----------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const navHeight = document.querySelector('.navbar')?.offsetHeight || 80;
                const top =
                    targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 16;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ----------------------------------------------------------
    // 7. SUBTLE TILT EFFECT (on hero ring)
    // ----------------------------------------------------------
    const heroContent = document.querySelector('.hero-content');
    const ring = document.querySelector('.ring-ring');
    if (heroContent && ring) {
        heroContent.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            ring.style.transform = `rotate(${x * 6}deg) skew(${y * 2}deg, ${x * 2}deg)`;
        });

        heroContent.addEventListener('mouseleave', function () {
            ring.style.transform = 'rotate(0deg) skew(0deg, 0deg)';
            ring.style.transition = 'transform 0.6s ease';
            setTimeout(() => {
                ring.style.transition = '';
            }, 600);
        });
        console.log('🌀 Tilt effect active');
    }

    console.log('🚀 Nexus landing page fully initialized');
});