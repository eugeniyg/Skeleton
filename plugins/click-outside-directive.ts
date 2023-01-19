export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('click-outside', {
        mounted(el, binding) {
            const handler = (e:any):void => {
                const targetElement = e.target as HTMLElement;
                if (!el.contains(targetElement) && el !== e.target) binding.value();
            };

            el.vueClickOutside = handler;

            document.addEventListener('click', handler);
        },

        beforeUnmount(el) {
            document.removeEventListener('click', el.vueClickOutside);
            el.vueClickOutside = null;
        },
    });
});
