export const localizePath = (path: string | undefined): string => {
  const globalStore = useGlobalStore();
  if (globalStore.currentLocale?.code.toLowerCase() === globalStore.defaultLocale?.code.toLowerCase()) {
    if (!path) return '';
    return path.startsWith('/') ? path : `/${path}`;
  }
  return `/${globalStore.currentLocale?.code.toLowerCase()}${!path || path === '/' ? '' : path}`;
};
