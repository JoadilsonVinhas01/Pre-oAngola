/**
 * PREÇO ANGOLA — script.js
 * Funcionalidades: tema, menu, scroll, animações,
 * contadores, barras, filtros, FAQ, formulários, toast.
 */

/* =============================================
   1. TEMA CLARO / ESCURO
   ============================================= */
(function initTheme() {
  const saved = localStorage.getItem('pa-theme') || 'dark';
  if (saved === 'light') document.body.classList.add('light');
  updateToggleIcon(saved);
})();

function updateToggleIcon(theme) {
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = theme === 'light' ? '🌙' : '☀️';
}

document.addEventListener('DOMContentLoaded', () => {
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light');
      const theme = isLight ? 'light' : 'dark';
      localStorage.setItem('pa-theme', theme);
      updateToggleIcon(theme);
    });
  }

  /* =============================================
     2. MENU HAMBURGER (MOBILE)
     ============================================= */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const open = navLinks.classList.contains('open');
      hamburger.setAttribute('aria-expanded', open);
    });

    // Fechar ao clicar num link
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* =============================================
     3. SCROLL — BOTÃO VOLTAR AO TOPO
     ============================================= */
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* =============================================
     4. SCROLL — HEADER SOMBRA
     ============================================= */
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10
        ? '0 2px 20px rgba(0,0,0,0.4)'
        : 'none';
    }, { passive: true });
  }

  /* =============================================
     5. ANIMAÇÃO DE ENTRADA (INTERSECTION OBSERVER)
     ============================================= */
  const animTargets = document.querySelectorAll(
    '.card, .service-card, .about-card, .contact-card, ' +
    '.testimonial-card, .info-card, .social-section, ' +
    '.contact-form-card, .timeline-item, .process-step, ' +
    '.pricing-card, .founder-card, .faq-item, .newsletter-card'
  );

  const appearObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger: delay proporcional à posição
        const siblings = [...entry.target.parentElement.children];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 80}ms`;
        entry.target.classList.add('visible');
        appearObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  animTargets.forEach(el => appearObserver.observe(el));

  /* =============================================
     6. CONTADORES ANIMADOS (HERO STATS)
     ============================================= */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => countObserver.observe(el));
  }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start    = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('pt-PT');
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString('pt-PT');
    }

    requestAnimationFrame(update);
  }

  /* =============================================
     7. BARRAS DE PROGRESSO (GRÁFICO MINI)
     ============================================= */
  const bars = document.querySelectorAll('.bar-fill');
  if (bars.length) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetWidth = entry.target.dataset.width || '0';
          entry.target.style.width = targetWidth + '%';
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(bar => barObserver.observe(bar));
  }

  /* =============================================
     8. FILTRO DE SERVIÇOS
     ============================================= */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const serviceCards = document.querySelectorAll('#servicesGrid .service-card');

  if (filterTabs.length) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Active tab
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.dataset.filter;

        serviceCards.forEach((card, i) => {
          const match = filter === 'all' || card.dataset.category === filter;

          if (match) {
            card.style.display = '';
            // Re-trigger animation with stagger
            card.classList.remove('visible');
            setTimeout(() => card.classList.add('visible'), i * 60);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* =============================================
     9. FAQ ACCORDION
     ============================================= */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (btn) {
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Fechar todos
        faqItems.forEach(f => f.classList.remove('open'));
        // Abrir este (se não estava aberto)
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  /* =============================================
     10. FORMULÁRIO DE CONTACTO
     ============================================= */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('.form-submit');
      btn.textContent = 'A enviar...';
      btn.disabled = true;

      // Simula envio
      setTimeout(() => {
        showToast('✅ Mensagem enviada! Entraremos em contacto em breve.');
        contactForm.reset();
        btn.textContent = 'Enviar mensagem →';
        btn.disabled = false;
      }, 1400);
    });
  }

  /* =============================================
     11. FORMULÁRIO DE NEWSLETTER
     ============================================= */
  const newsletterForms = document.querySelectorAll('#newsletterForm, .newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        showToast('🎉 Subscrito com sucesso! Obrigado por se juntar a nós.');
        form.reset();
      }
    });
  });

  /* =============================================
     12. TOAST NOTIFICATION
     ============================================= */
  function showToast(msg, duration = 4000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  }

  // Expor globalmente se necessário
  window.showToast = showToast;

  /* =============================================
     13. ANIMAÇÃO DE ENTRADA DO HERO (preco.html)
     ============================================= */
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle) {
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(30px)';
    // Já é controlado pelo CSS animation, mas garantimos o reset
  }

  /* =============================================
     14. LINK ATIVO AUTOMÁTICO
     ============================================= */
  const currentFile = window.location.pathname.split('/').pop() || 'preco.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentFile) {
      link.classList.add('active');
    }
  });

  /* =============================================
     15. EFEITO DE HOVER NAS CARDS (RIPPLE)
     ============================================= */
  document.querySelectorAll('.card, .service-card, .pricing-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, var(--bg-card-hover), var(--bg-card))`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

  /* =============================================
     16. LAZY LOADING DAS IMAGENS (futuro)
     ============================================= */
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
    });
  }

  /* =============================================
     17. REDUCIR ANIMAÇÕES (ACESSIBILIDADE)
     ============================================= */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition', '0.01ms');
    document.querySelectorAll('[style*="animation"]').forEach(el => {
      el.style.animation = 'none';
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

}); // END DOMContentLoaded
