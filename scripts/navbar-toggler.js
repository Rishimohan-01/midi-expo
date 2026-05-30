(function () {
      var togglers = document.querySelectorAll('.navbar-toggler');
      togglers.forEach(function(toggler) {
        var targetId = toggler.getAttribute('data-target') || 'mobileMenu';
        var menu = document.getElementById('mobileMenu');
        if (!menu) return;
        toggler.addEventListener('click', function () {
          var open = menu.classList.contains('show');
          if (open) {
            menu.classList.remove('show');
            toggler.setAttribute('aria-expanded', 'false');
          } else {
            menu.classList.add('show');
            toggler.setAttribute('aria-expanded', 'true');
          }
        });
      });
      // Close on outside click
      document.addEventListener('click', function (e) {
        var menu = document.getElementById('mobileMenu');
        var toggler = document.querySelector('.navbar-toggler');
        if (!menu || !toggler) return;
        if (!menu.contains(e.target) && !toggler.contains(e.target)) {
          menu.classList.remove('show');
          toggler.setAttribute('aria-expanded', 'false');
        }
      });
      // Close on nav link click
      var menu2 = document.getElementById('mobileMenu');
      if (menu2) {
        menu2.querySelectorAll('.nav-link').forEach(function(link) {
          link.addEventListener('click', function () {
            menu2.classList.remove('show');
            document.querySelector('.navbar-toggler') &&
              document.querySelector('.navbar-toggler').setAttribute('aria-expanded', 'false');
          });
        });
      }
    })();