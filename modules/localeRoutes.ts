export default function LocaleRoutesModule() {
  const changeName = (someArray) => someArray.map((item) => ({
    ...item,
    name: `locale-${item.name}`,
    children: item.children.length ? changeName(item.children) : [],
  }));

  this.nuxt.hook('pages:extend', (pages: Array<any>) => {
    const localeRoutes = pages.map((page) => ({
        name: `locale-${page.name}`,
        path: `/:locale([a-z]{2}|[a-z]{2}-[a-z]{2})${page.path}`,
        file: page.file,
        children: changeName(page.children),
      }));

    pages.push(...localeRoutes);
  });
}
