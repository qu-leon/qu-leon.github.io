/* =============================================
   Leon Qu Portfolio — Interactive Scripts
   ============================================= */

(function () {
  'use strict';

  // ---- Shooting Stars Canvas Background ----
  const canvas = document.getElementById('neural-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    let shootingStars = [];
    const STAR_COUNT = 250;
    const MAX_SHOOTING = 6;
    let spawnTimer = 0;

    canvas.style.pointerEvents = 'none';

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createStars() {
      stars = [];
      for (var i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 2.2 + 0.5,
          baseAlpha: Math.random() * 0.5 + 0.35,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    function spawnShootingStar() {
      var startX = Math.random() * canvas.width * 1.2;
      var startY = Math.random() * canvas.height * 0.5;
      var angle = (Math.random() * 30 + 20) * Math.PI / 180;
      var speed = Math.random() * 8 + 6;
      shootingStars.push({
        x: startX,
        y: startY,
        vx: -Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: Math.random() * 0.006 + 0.004,
        len: Math.random() * 120 + 80,
        width: Math.random() * 2.5 + 1.2,
        hue: Math.random() > 0.5 ? 187 : 260
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw twinkling stars
      var time = Date.now() * 0.001;
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var alpha = s.baseAlpha + Math.sin(time * s.twinkleSpeed * 60 + s.phase) * 0.25;
        if (alpha < 0.05) alpha = 0.05;
        ctx.fillStyle = 'rgba(200, 220, 255, ' + alpha + ')';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Spawn shooting stars
      spawnTimer++;
      if (spawnTimer > 30 + Math.random() * 50 && shootingStars.length < MAX_SHOOTING) {
        spawnShootingStar();
        spawnTimer = 0;
      }

      // Draw shooting stars
      for (var j = shootingStars.length - 1; j >= 0; j--) {
        var ss = shootingStars[j];
        var tailX = ss.x - ss.vx / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy) * ss.len;
        var tailY = ss.y - ss.vy / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy) * ss.len;

        var grad = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
        grad.addColorStop(0, 'hsla(' + ss.hue + ', 90%, 85%, ' + ss.life + ')');
        grad.addColorStop(0.3, 'hsla(' + ss.hue + ', 85%, 70%, ' + (ss.life * 0.7) + ')');
        grad.addColorStop(0.7, 'hsla(' + ss.hue + ', 80%, 60%, ' + (ss.life * 0.3) + ')');
        grad.addColorStop(1, 'hsla(' + ss.hue + ', 80%, 50%, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = ss.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Outer glow
        ctx.fillStyle = 'hsla(' + ss.hue + ', 80%, 70%, ' + (ss.life * 0.3) + ')';
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, ss.width + 4, 0, Math.PI * 2);
        ctx.fill();

        // Bright head glow
        ctx.fillStyle = 'hsla(' + ss.hue + ', 95%, 90%, ' + ss.life + ')';
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, ss.width + 1, 0, Math.PI * 2);
        ctx.fill();

        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life -= ss.decay;

        if (ss.life <= 0 || ss.x < -100 || ss.y > canvas.height + 100) {
          shootingStars.splice(j, 1);
        }
      }

      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', function () {
      resize();
      createStars();
    });

    resize();
    createStars();
    draw();
  }

  // ---- Typing Effect ----
  const typedEl = document.getElementById('typed-output');
  if (typedEl) {
    const phrases = [
      'Machine Learning',
      'Data Science',
      'Software Engineering',
      'Semiconductor Manufacturing Automation',
      'Tech Enthusiast',
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function typeLoop() {
      const currentPhrase = phrases[phraseIdx];

      if (isDeleting) {
        typedEl.textContent = currentPhrase.substring(0, charIdx - 1);
        charIdx--;
        typeSpeed = 40;
      } else {
        typedEl.textContent = currentPhrase.substring(0, charIdx + 1);
        charIdx++;
        typeSpeed = 80;
      }

      if (!isDeleting && charIdx === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        typeSpeed = 400;
      }

      setTimeout(typeLoop, typeSpeed);
    }

    setTimeout(typeLoop, 1000);
  }

  // ---- GSAP + ScrollTrigger Setup ----
  gsap.registerPlugin(ScrollTrigger);

  // ---- Hero Content Entrance ----
  var heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    var heroTl = gsap.timeline({ delay: 0.3 });
    heroTl
      .fromTo('.hero-greeting', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
      .fromTo('.hero-name', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3')
      .fromTo('.hero-typing-wrapper', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
      .fromTo('.hero-bio', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.15, ease: 'power3.out' }, '-=0.2')
      .fromTo('.hero-location', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '-=0.2')
      .fromTo('.social-btn', { opacity: 0, y: 15, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(1.7)' }, '-=0.2')
      .fromTo('.hero-image-wrapper', { opacity: 0, scale: 0.8, rotate: -8 }, { opacity: 1, scale: 1, rotate: 0, duration: 1, ease: 'elastic.out(1, 0.5)' }, '-=1.5')
      .fromTo('.scroll-indicator', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.1');
  }

  // ---- Section Title Animations ----
  gsap.utils.toArray('.section-title').forEach(function (title) {
    gsap.fromTo(title,
      { opacity: 0, x: -40 },
      {
        scrollTrigger: {
          trigger: title,
          start: 'top 95%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: 'power3.out'
      }
    );
  });

  // ---- Project Cards — staggered grid reveal ----
  gsap.utils.toArray('.project-card').forEach(function (card, i) {
    gsap.fromTo(card,
      { opacity: 0, y: 30, scale: 0.97 },
      {
        scrollTrigger: {
          trigger: card,
          start: 'top 95%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        delay: i % 3 * 0.06,
        ease: 'power3.out'
      }
    );
  });

  // ---- Timeline Items — slide in from left with line draw ----
  gsap.utils.toArray('.timeline-item').forEach(function (item, i) {
    var marker = item.querySelector('.timeline-marker');
    var content = item.querySelector('.timeline-content');

    gsap.fromTo(marker,
      { scale: 0 },
      {
        scrollTrigger: {
          trigger: item,
          start: 'top 95%',
          toggleActions: 'play none none none'
        },
        scale: 1,
        duration: 0.25,
        ease: 'back.out(2)'
      }
    );

    gsap.fromTo(content,
      { opacity: 0, x: -25 },
      {
        scrollTrigger: {
          trigger: item,
          start: 'top 95%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        x: 0,
        duration: 0.35,
        delay: 0.05,
        ease: 'power3.out'
      }
    );
  });

  // ---- Education Cards — pop in ----
  gsap.utils.toArray('.edu-card').forEach(function (card, i) {
    gsap.fromTo(card,
      { opacity: 0, y: 25, scale: 0.95 },
      {
        scrollTrigger: {
          trigger: card,
          start: 'top 95%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.35,
        delay: i * 0.08,
        ease: 'back.out(1.4)'
      }
    );
  });

  // ---- Skill Categories — staggered fade up ----
  gsap.utils.toArray('.skill-category').forEach(function (cat, i) {
    gsap.fromTo(cat,
      { opacity: 0, y: 25 },
      {
        scrollTrigger: {
          trigger: cat,
          start: 'top 95%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 0.35,
        delay: i % 3 * 0.05,
        ease: 'power3.out',
        onComplete: function () {
          gsap.fromTo(cat.querySelectorAll('.skill-tag'),
            { opacity: 0, scale: 0.8, y: 6 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.2,
              stagger: 0.02,
              ease: 'back.out(1.7)'
            }
          );
        }
      }
    );
  });

  // ---- Award Items — slide in from right ----
  gsap.utils.toArray('.award-item').forEach(function (item, i) {
    gsap.fromTo(item,
      { opacity: 0, x: 35 },
      {
        scrollTrigger: {
          trigger: item,
          start: 'top 95%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        x: 0,
        duration: 0.35,
        delay: i * 0.05,
        ease: 'power3.out'
      }
    );
  });

  // ---- Parallax on Section Titles ----
  gsap.utils.toArray('.section-title').forEach(function (title) {
    gsap.to(title, {
      scrollTrigger: {
        trigger: title,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: -20,
      ease: 'none'
    });
  });

  // ---- Navbar Scroll Effect (GSAP) ----
  var navbar = document.getElementById('navbar');
  var navLinks = document.querySelectorAll('.nav-link');
  var sections = document.querySelectorAll('.section');

  ScrollTrigger.create({
    start: 50,
    onUpdate: function (self) {
      if (self.scroll() > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });

  // Active section highlighting via ScrollTrigger
  sections.forEach(function (section) {
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onToggle: function (self) {
        if (self.isActive) {
          var id = section.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      }
    });
  });

  // ---- Smooth Scroll for Nav Links ----
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = this.getAttribute('href');
      var target = document.querySelector(targetId);
      if (target) {
        gsap.to(window, {
          scrollTo: { y: target, offsetY: 0 },
          duration: 1,
          ease: 'power2.inOut'
        });
      }
      // Close mobile menu
      var navList = document.querySelector('.nav-links');
      var toggle = document.querySelector('.nav-toggle');
      navList.classList.remove('open');
      toggle.classList.remove('active');
    });
  });

  // ---- Mobile Nav Toggle ----
  var navToggle = document.querySelector('.nav-toggle');
  var navList = document.querySelector('.nav-links');

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      navList.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
  }

  // ---- Skill Tag Hover (GSAP) ----
  var skillTags = document.querySelectorAll('.skill-tag');
  skillTags.forEach(function (tag) {
    tag.addEventListener('mouseenter', function () {
      gsap.to(this, {
        scale: 1.08,
        boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
        duration: 0.25,
        ease: 'power2.out'
      });
    });
    tag.addEventListener('mouseleave', function () {
      gsap.to(this, {
        scale: 1,
        boxShadow: 'none',
        duration: 0.25,
        ease: 'power2.out'
      });
    });
  });

  // ---- Footer reveal ----
  gsap.fromTo('.footer',
    { opacity: 0, y: 20 },
    {
      scrollTrigger: {
        trigger: '.footer',
        start: 'top 95%',
        toggleActions: 'play none none none'
      },
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out'
    }
  );

})();
