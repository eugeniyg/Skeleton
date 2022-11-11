import { useNuxt } from '@nuxt/kit';
import { NuxtPage } from '@nuxt/schema';

export default function LocaleRoutesModule() {
  const changeName = (pagesArray: NuxtPage[]):NuxtPage[] => pagesArray.map((item) => ({
    ...item,
    name: `locale-${item.name}`,
    children: item.children?.length ? changeName(item.children) : [],
  }));

  const nuxt = useNuxt();
  nuxt.hook('pages:extend', (pages: NuxtPage[]) => {
    const localeRoutes = pages.map((page) => ({
        name: `locale-${page.name}`,
        path: `/:locale([a-z]{2}|[a-z]{2}-[a-z]{2})${page.path}`,
        file: page.file,
        children: changeName(page.children || []),
      }));

    pages.push(...localeRoutes);
  });
}
