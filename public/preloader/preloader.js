window.startPagePreloader = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  document.getElementById('__nuxt').style.overflow = 'hidden';

  const preloaderEl = document.querySelector('.preloader');
  preloaderEl.classList.remove('is-hide');
  preloaderEl.classList.remove('is-none');

  if (!preloaderEl) {
    console.error('No preloader HTML element. Add it in app.html');
    return;
  }

  function hide() {
    setTimeout(() => {
      document.removeEventListener('preloader:done', hide);
      preloaderEl.classList.add('is-hide');
    }, 500);

    setTimeout(() => {
      document.getElementById('__nuxt').style.overflow = '';
    }, 500);

    setTimeout(() => {
      preloaderEl.classList.add('is-none');
    }, 1000);
  }

  document.addEventListener('preloader:done', hide, false);
};

window.startPagePreloader();
