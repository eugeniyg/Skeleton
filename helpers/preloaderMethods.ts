export const preloaderStart = (): void => {
  const preloaderEl = document.querySelector('.preloader');
  if (preloaderEl) preloaderEl.classList.value = 'preloader';
};

export const preloaderDone = (): void => {
  const preloaderEl = document.querySelector('.preloader');
  if (preloaderEl?.classList.contains('is-none')) return;

  preloaderEl?.classList.add('is-hide');

  setTimeout(() => {
    preloaderEl?.classList.add('is-none');
  }, 300);
};
