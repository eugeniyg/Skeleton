import { NuxtPage } from '@nuxt/schema';

const { createWriteStream } = require('fs');
const { SitemapStream } = require('sitemap');

export default async (inlineOptions:any, nuxt:any) => {
  if (process.env.NODE_ENV === 'development') return;
  const mapPages: any = [];

  nuxt.hook('pages:extend', (pages: NuxtPage[]) => {
    const hidePages = ['slug', 'password-reset-resetCode', 'verify-confirmCode'];
    pages.forEach((page) => {
      if (page.name && !hidePages.includes(page.name)) {
        mapPages.push({
          url: page.path,
          changefreq: 'daily',
          priority: 0.8,
        });
      }
    });
    const sitemap = new SitemapStream({ hostname: 'http://example.com' });

    const writeStream = createWriteStream('./public/sitemap.xml');
    sitemap.pipe(writeStream);

    mapPages.forEach((item: any) => {
      sitemap.write(item);
    });

    sitemap.end();
  });
};
