import { nextTick } from 'vue';
import { RouterConfig } from '@nuxt/schema';
import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useNuxtApp } from '#app';

function isDifferentRoute(a:RouteLocationNormalized, b:RouteLocationNormalized) {
  const samePageComponent = a.matched[0] === b.matched[0];
  if (!samePageComponent) {
    return true;
  }

  if (samePageComponent && JSON.stringify(a.params) !== JSON.stringify(b.params)) {
    return true;
  }
  return false;
}

function changeRoute(pagesArray: RouteRecordRaw[]):RouteRecordRaw[] {
  return pagesArray.map((item) => ({
    ...item,
    name: `locale-${item.name as string}`,
    children: item.children?.length ? changeRoute(item.children) : [],
  }));
}

export default <RouterConfig> {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    let position:any = savedPosition || undefined;
    if (!position && from && to && to.meta.scrollToTop !== false && isDifferentRoute(from, to)) {
      position = { left: 0, top: 0 };
    }

    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce('page:transition:finish', async () => {
        await nextTick();
        resolve(position);
      });
    });
  },

  routes: (routes) => {
    const localeRoutes = routes.map((page) => ({
      ...page,
      name: `locale-${page.name as string}`,
      path: `/:locale([a-z]{2}|[a-z]{2}-[a-z]{2})${page.path}`,
      children: changeRoute(page.children || []),
    }));

    return [...routes, ...localeRoutes];
  },
};
