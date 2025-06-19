export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.directive('router-links', {
    mounted(el) {
      const linksArr: any[] = el.getElementsByTagName('a');
      if (!linksArr?.length) return;

      const clickRouterLink = async (e: any): Promise<void> => {
        e.preventDefault();
        const router = useRouter();
        const { localizePath } = useProjectMethods();
        const targetElement = e.target as HTMLElement;
        const linkHref = targetElement.getAttribute('href') || '';
        await router.push(localizePath(linkHref));
      };

      [...linksArr].forEach(linkElement => {
        const linkHref = linkElement.getAttribute('href');
        if (linkHref && !linkHref.startsWith('http')) {
          linkElement.vueClickLink = clickRouterLink;
          linkElement.addEventListener('click', linkElement.vueClickLink);
        }
      });
    },

    beforeUnmount(el) {
      const linksArr: any[] = el.getElementsByTagName('a');
      if (!linksArr?.length) return;
      [...linksArr].forEach(linkElement => {
        const linkHref = linkElement.getAttribute('href');
        if (linkHref && !linkHref.startsWith('http')) {
          linkElement.removeEventListener('click', linkElement.vueClickLink);
          linkElement.vueClickLink = null;
        }
      });
    },
  });
});
