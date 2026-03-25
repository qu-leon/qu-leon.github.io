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

  // ---- Scroll Reveal ----
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry, idx) {
        if (entry.isIntersecting) {
          // Stagger siblings
          var siblings = entry.target.parentElement.querySelectorAll('.reveal');
          var index = Array.prototype.indexOf.call(siblings, entry.target);
          var delay = index * 100;
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  reveals.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ---- Navbar Scroll Effect ----
  var navbar = document.getElementById('navbar');
  var navLinks = document.querySelectorAll('.nav-link');
  var sections = document.querySelectorAll('.section');

  window.addEventListener('scroll', function () {
    // Background on scroll
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlighting
    var scrollPos = window.scrollY + 150;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
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
        target.scrollIntoView({ behavior: 'smooth' });
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

  // ---- Skill Tag Glow on Hover (interactive pulse) ----
  var skillTags = document.querySelectorAll('.skill-tag');
  skillTags.forEach(function (tag) {
    tag.addEventListener('mouseenter', function () {
      this.style.boxShadow = '0 0 20px ' + 'rgba(6, 182, 212, 0.4)';
    });
    tag.addEventListener('mouseleave', function () {
      this.style.boxShadow = '';
    });
  });

})();
