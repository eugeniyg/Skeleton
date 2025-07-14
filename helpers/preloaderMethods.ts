export const preloaderStart = (): void => {
  const preloaderEl = document.querySelector('.preloader');
  if (preloaderEl) preloaderEl.classList.value = 'preloader';
};

export const preloaderDone = (): void => {
  const preloaderEl = document.querySelector('.preloader');
  if (preloaderEl?.classList.contains('is-none')) return;

  setTimeout(() => {
    preloaderEl?.classList.add('is-hide');
  }, 500);

  setTimeout(() => {
    preloaderEl?.classList.add('is-none');
  }, 1000);
};
