// ========== HERO SLIDER ==========
    (function () {
      const slides = document.querySelectorAll('.hero-slider .slide');
      const dots   = document.querySelectorAll('.slider-dots .dot');
      let current  = 0;
      let timer;

      function goTo(idx) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (idx + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
      }

      function next() { goTo(current + 1); }
      function prev() { goTo(current - 1); }

      function resetTimer() {
        clearInterval(timer);
        timer = setInterval(next, 4500);
      }

      document.getElementById('sliderNext').addEventListener('click', () => { next(); resetTimer(); });
      document.getElementById('sliderPrev').addEventListener('click', () => { prev(); resetTimer(); });

      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          goTo(parseInt(dot.dataset.index));
          resetTimer();
        });
      });

      // Pause on hover
      document.querySelector('.hero-slider').addEventListener('mouseenter', () => clearInterval(timer));
      document.querySelector('.hero-slider').addEventListener('mouseleave', resetTimer);

      resetTimer();
    })();