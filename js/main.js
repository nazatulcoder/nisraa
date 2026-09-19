/* =========================================================
   NISRAA — Main JavaScript
   Premium clinical-elegant website interactions
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  // =========================================================
  // 1. MOBILE HAMBURGER NAVIGATION
  // =========================================================
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileNav.classList.contains('open');
      mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close nav when a link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // =========================================================
  // 2. STICKY HEADER ON SCROLL
  // =========================================================
  const header = document.getElementById('header');
  let lastScrollY = 0;

  function handleScroll() {
    const scrollY = window.scrollY;

    // Add scrolled class for shadow
    if (scrollY > 50) {
      header && header.classList.add('scrolled');
    } else {
      header && header.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // =========================================================
  // 3. FAQ ACCORDION
  // =========================================================
  const faqItems = document.querySelectorAll('[data-faq]');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all items
      faqItems.forEach(other => {
        other.classList.remove('open');
        const otherAnswer = other.querySelector('.faq-answer');
        if (otherAnswer) {
          otherAnswer.style.maxHeight = '0';
          otherAnswer.style.paddingBottom = '0';
        }
      });

      // Open clicked item if it was closed
      if (!isOpen) {
        item.classList.add('open');
        // Measure full natural height
        answer.style.maxHeight = 'none';
        const fullHeight = answer.scrollHeight + 24;
        answer.style.maxHeight = '0';
        // Force reflow so transition fires
        void answer.offsetHeight;
        answer.style.maxHeight = fullHeight + 'px';
        answer.style.paddingBottom = '20px';
      }
    });
  });

  // =========================================================
  // 4. SMOOTH SCROLL FOR ANCHOR LINKS
  // =========================================================
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 80;
        const targetY = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({ top: targetY, behavior: 'smooth' });

        // Close mobile nav if open
        if (mobileNav) {
          mobileNav.classList.remove('open');
          hamburger && hamburger.classList.remove('open');
          document.body.style.overflow = '';
        }
      }
    });
  });

  // =========================================================
  // 5. SCROLL ANIMATIONS — INTERSECTION OBSERVER
  // =========================================================
  const animateEls = document.querySelectorAll(
    '.product-card, .concern-card, .benefit-card, .ingredient-card, ' +
    '.proof-btn, .large-proof-btn, .tech-proof-item, .reward-step, ' +
    '.how-step, .stat-card, .comparison-card, .faq-item, .contact-info-item'
  );

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animateEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity 0.5s ease ${(i % 4) * 0.08}s, transform 0.5s ease ${(i % 4) * 0.08}s`;
      observer.observe(el);
    });

    // Add animate-in handler
    const style = document.createElement('style');
    style.textContent = `.animate-in { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(style);
  }

  // =========================================================
  // 6. COPY BUTTON FUNCTIONALITY (Affiliate Dashboard)
  // =========================================================
  document.querySelectorAll('.dashboard-copy-btn').forEach(btn => {
    const originalText = btn.textContent;
    btn.addEventListener('click', function () {
      const linkVal = this.closest('.dashboard-link-box')?.querySelector('.dashboard-link-val');
      if (linkVal) {
        navigator.clipboard.writeText(linkVal.textContent.trim()).then(() => {
          this.textContent = '✓ Copied!';
          this.style.background = 'rgba(201,169,110,0.25)';
          this.style.color = '#c9a96e';
          setTimeout(() => {
            this.textContent = originalText;
            this.style.background = '';
            this.style.color = '';
          }, 2000);
        }).catch(() => {
          this.textContent = '✓ Copied!';
          setTimeout(() => { this.textContent = originalText; }, 2000);
        });
      }
    });
  });

  // =========================================================
  // 7. LOYALTY TRACKER PROGRESS ANIMATION
  // =========================================================
  const trackerDots = document.querySelectorAll('.tracker-dot, .big-dot');

  if (trackerDots.length && 'IntersectionObserver' in window) {
    const dotObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const dots = entry.target.querySelectorAll('.tracker-dot, .big-dot');
          dots.forEach((dot, i) => {
            setTimeout(() => {
              dot.style.transition = 'all 0.4s ease';
            }, i * 100);
          });
          dotObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    const trackers = document.querySelectorAll('.loyalty-tracker, .big-loyalty-tracker');
    trackers.forEach(t => dotObserver.observe(t));
  }

  // =========================================================
  // 8. ACTIVE NAV LINK HIGHLIGHT
  // =========================================================
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.split('#')[0] === currentPath) {
      link.classList.add('active');
    }
  });

  // =========================================================
  // 9. HERO SECTION ENTRANCE ANIMATION
  // =========================================================
  const heroContent = document.querySelector('.hero-content');
  const heroVisual = document.querySelector('.hero-visual');

  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    heroContent.style.transition = 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s';
    setTimeout(() => {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 100);
  }

  if (heroVisual) {
    heroVisual.style.opacity = '0';
    heroVisual.style.transform = 'translateX(30px)';
    heroVisual.style.transition = 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s';
    setTimeout(() => {
      heroVisual.style.opacity = '1';
      heroVisual.style.transform = 'translateX(0)';
    }, 200);
  }

  // =========================================================
  // 10. ANNOUNCEMENT BAR DISMISSAL
  // =========================================================
  const announcementBar = document.querySelector('.announcement-bar');
  if (announcementBar) {
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: rgba(255,255,255,0.5);
      font-size: 18px;
      cursor: pointer;
      line-height: 1;
      padding: 0;
    `;
    announcementBar.style.position = 'relative';
    announcementBar.appendChild(closeBtn);

    closeBtn.addEventListener('click', () => {
      announcementBar.style.maxHeight = announcementBar.offsetHeight + 'px';
      announcementBar.style.transition = 'max-height 0.3s ease, padding 0.3s ease, opacity 0.3s ease';
      setTimeout(() => {
        announcementBar.style.maxHeight = '0';
        announcementBar.style.padding = '0';
        announcementBar.style.opacity = '0';
        announcementBar.style.overflow = 'hidden';
      }, 10);
    });
  }

  // =========================================================
  // 11. TRUST STRIP SCROLL MARQUEE on small screens
  // =========================================================
  function checkMobileScroll() {
    const trustStrip = document.querySelector('.trust-strip-inner');
    if (trustStrip && window.innerWidth < 600) {
      trustStrip.style.overflowX = 'auto';
      trustStrip.style.flexWrap = 'nowrap';
      trustStrip.style.paddingBottom = '8px';
    }
  }
  checkMobileScroll();
  window.addEventListener('resize', checkMobileScroll);

  // =========================================================
  // 12. PRODUCT CARD HOVER — subtle glow effect
  // =========================================================
  document.querySelectorAll('.product-card.featured').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = '0 24px 80px rgba(26,58,46,0.25)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
    });
  });

  // =========================================================
  // 13. MOBILE STICKY BAR — hide when footer is visible
  // =========================================================
  const stickyBar = document.querySelector('.mobile-sticky-bar');
  const footer = document.querySelector('.footer');

  if (stickyBar && footer && 'IntersectionObserver' in window) {
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        stickyBar.style.transform = entry.isIntersecting ? 'translateY(100%)' : 'translateY(0)';
        stickyBar.style.transition = 'transform 0.3s ease';
      });
    }, { threshold: 0.1 });

    footerObserver.observe(footer);
  }

  // =========================================================
  // 14. SCROLL PROGRESS INDICATOR
  // =========================================================
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    background: linear-gradient(90deg, #1a3a2e, #c9a96e);
    z-index: 9999;
    width: 0%;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }, { passive: true });

});
