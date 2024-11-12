export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.directive('click-outside', {
    mounted(el, binding) {
      const clickHandler = (e: any): void => {
        const targetElement = e.target as HTMLElement;
        if (!el.contains(targetElement) && el !== e.target) binding.value();
      };

      const blurHandler = (): void => {
        binding.value();
      };

      el.vueClickOutside = clickHandler;
      el.vueBlurOutsideWindow = blurHandler;

      document.addEventListener('click', clickHandler);
      window.addEventListener('blur', blurHandler);
    },

    beforeUnmount(el) {
      document.removeEventListener('click', el.vueClickOutside);
      window.removeEventListener('blur', el.vueBlurOutsideWindow);
      el.vueClickOutside = null;
      el.vueBlurOutsideWindow = null;
    },
  });
});
