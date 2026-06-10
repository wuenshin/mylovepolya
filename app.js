/* ============================================================
   ДЛЯ ПОЛЕЧКИ — общий скрипт
   reveal при скролле • лёгкий параллакс • переход между страницами
   Подключается на каждой странице: <script src="app.js" defer></script>
   Музыкальный скрипт у тебя остаётся отдельно — этот его не трогает.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Снимаем «закатную волну» — страница проявляется */
  requestAnimationFrame(() => document.body.classList.add('loaded'));

  /* 2. Появление элементов при скролле */
  const items = document.querySelectorAll('[data-reveal]');

  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    items.forEach(el => io.observe(el));
  }

  /* 3. Лёгкий параллакс (например, фото в hero) */
  if (!reduce) {
    const layers = [...document.querySelectorAll('[data-parallax]')];
    if (layers.length) {
      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          layers.forEach(l => {
            const speed = parseFloat(l.dataset.parallax) || -0.1;
            l.style.transform = `translate3d(0, ${y * speed}px, 0)`;
          });
          ticking = false;
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }

  /* 4. Мягкий переход между страницами (закатная волна возвращается) */
  if (!reduce) {
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const url = link.getAttribute('href');
        if (!url || link.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        document.body.classList.add('leaving');
        setTimeout(() => { window.location.href = url; }, 430);
      });
    });
  }

});
