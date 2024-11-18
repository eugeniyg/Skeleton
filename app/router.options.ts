import type { RouterConfig } from '@nuxt/schema';
import type { RouteRecordRaw } from 'vue-router';

function changeRoute(pagesArray: RouteRecordRaw[]): RouteRecordRaw[] {
  return pagesArray.map(item => ({
    ...item,
    name: `locale-${item.name as string}`,
    children: item.children?.length ? changeRoute(item.children) : [],
  }));
}

export default <RouterConfig>{
  routes: routes => {
    const runtimeConfig = useRuntimeConfig();
    const hideBettingPage =
      !runtimeConfig.public?.betsyParams?.clientHost || !runtimeConfig.public?.betsyParams?.clientId;
    const hideProfileDocumentsPage =
      (runtimeConfig.public?.sumsub?.enabled && runtimeConfig.public?.sumsub?.hideDocumentsPage) ||
      (runtimeConfig.public?.kycaid?.enabled && runtimeConfig.public?.kycaid?.hideDocumentsPage);
    const hideLoyaltyPage = !runtimeConfig.public?.loyaltyEnabled;

    const defaultRoutes = [];
    for (const page of routes) {
      if ((page.name === 'betting' && hideBettingPage) || (page.name === 'loyalty' && hideLoyaltyPage)) continue;
      else if (page.name === 'profile' && hideProfileDocumentsPage) {
        const filteredChildren = page.children?.filter(page => page.name !== 'profile-documents');
        defaultRoutes.push({ ...page, children: filteredChildren });
      } else defaultRoutes.push(page);
    }

    const localeRoutes = defaultRoutes.map(page => ({
      ...page,
      name: `locale-${page.name as string}`,
      path: `/:locale([a-z]{2}|[a-z]{2}-[a-z]{2})${page.path}`,
      children: changeRoute(page.children || []),
    }));

    return [...defaultRoutes, ...localeRoutes];
  },
};
