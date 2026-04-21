/* Fractal Media Solutions — main.js */

// ─── Nav scroll shadow ───
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// ─── Mobile hamburger ───
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger?.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  const spans = hamburger.querySelectorAll('span');
  if (open) {
    spans[0].style.cssText = 'transform: translateY(7px) rotate(45deg)';
    spans[1].style.cssText = 'opacity: 0';
    spans[2].style.cssText = 'transform: translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => s.style.cssText = '');
  }
});

// Close mobile nav on link click
mobileNav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
    hamburger.querySelectorAll('span').forEach(s => s.style.cssText = '');
  });
});

// ─── Active nav link ───
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  } else {
    a.classList.remove('active');
  }
});

// ─── Contact form ───
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Basic validation
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = '#e05050';
      valid = false;
    } else {
      field.style.borderColor = '';
    }
  });

  if (!valid) return;

  // Submit to Formspree
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;

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
      form.style.display = 'none';
      formSuccess.style.display = 'block';
    } else {
      btn.textContent = 'Send Message →';
      btn.disabled = false;
      alert('There was an error sending your message. Please try again.');
    }
  } catch (error) {
    btn.textContent = 'Send Message →';
    btn.disabled = false;
    alert('There was an error sending your message. Please try again.');
  }
});

// ─── Smooth scroll for anchor links ───
document.querySelectorAll('a[href*="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const [page, hash] = a.getAttribute('href').split('#');
    const onSamePage = !page || page === currentPage || page === '';
    if (onSamePage && hash) {
      const target = document.getElementById(hash);
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
        window.scrollTo({ top: target.offsetTop - navH - 16, behavior: 'smooth' });
      }
    }
  });
});

// ─── Services Carousel ───
const carousel = document.getElementById('servicesCarousel');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');

if (carousel) {
  const cards = carousel.querySelectorAll('.service-card');
  let currentIndex = 0;

  const showCard = (index) => {
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === index);
    });
  };

  const nextCard = () => {
    currentIndex = (currentIndex + 1) % cards.length;
    showCard(currentIndex);
  };

  const prevCard = () => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    showCard(currentIndex);
  };

  prevBtn?.addEventListener('click', prevCard);
  nextBtn?.addEventListener('click', nextCard);

  // Auto-rotate every 5 seconds
  setInterval(nextCard, 5000);

  // Click to navigate
  carousel.addEventListener('click', (e) => {
    const card = e.target.closest('.service-card');
    if (card && card.classList.contains('active')) {
      const link = card.querySelector('.service-card__link');
      if (link) {
        window.location.href = link.href;
      }
    }
  });
}

// ─── Fade-in on scroll ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .price-card, .ai-card, .team-card, .value-item, .episode-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
  observer.observe(el);
});
