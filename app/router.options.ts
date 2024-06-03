import type { RouterConfig } from '@nuxt/schema';
import type { RouteRecordRaw } from 'vue-router';

function changeRoute(pagesArray: RouteRecordRaw[]):RouteRecordRaw[] {
  return pagesArray.map((item) => ({
    ...item,
    name: `locale-${item.name as string}`,
    children: item.children?.length ? changeRoute(item.children) : [],
  }));
}

export default <RouterConfig> {
  routes: (routes) => {
    const runtimeConfig = useRuntimeConfig();
    const hasBetsyIntegration = runtimeConfig.public?.betsyParams?.clientHost && runtimeConfig.public?.betsyParams?.clientId;
    const defaultRoutes = routes.filter(page => {
      return page.name !== 'betting' || hasBetsyIntegration;
    })

    const localeRoutes = defaultRoutes.map((page) => ({
      ...page,
      name: `locale-${page.name as string}`,
      path: `/:locale([a-z]{2}|[a-z]{2}-[a-z]{2})${page.path}`,
      children: changeRoute(page.children || []),
    }));

    return [...defaultRoutes, ...localeRoutes];
  },
};
