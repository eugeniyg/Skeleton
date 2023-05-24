import { NuxtPage } from '@nuxt/schema';
import { $fetch } from 'ofetch';
import { GamesResponseInterface, LocaleInterface, CollectionInterface } from '@platform/frontend-core/dist/module';

const { createWriteStream, readdirSync } = require('fs');
const { SitemapStream } = require('sitemap');

export default async (inlineOptions:any, nuxt:any) => {
  if (process.env.NODE_ENV === 'development') return;
  const mapPages: any = [];
  let hookRan: boolean = false;

  const baseUrl = process.env.API_BASE_URL || 'https://slotsbet.io';
  const localesResponse: { data: LocaleInterface[] } = await $fetch(`${baseUrl}/api/settings/locales`);
  const collectionsResponse:{ data: CollectionInterface[] } = await $fetch(`${baseUrl}/api/game/collections`);
  let gamesIdentities:string[] = [];
  const getGames = async (page: number):Promise<void> => {
    const gamesResponse: GamesResponseInterface = await $fetch(`${baseUrl}/api/game/games`, { params: { page, perPage: 100 } });
    const identityArr = gamesResponse.data.map((game) => (game.identity));
    gamesIdentities = gamesIdentities.concat(identityArr);
    if (gamesResponse.meta.page < gamesResponse.meta.totalPages) await getGames(page + 1);
  };
  await getGames(1);

  const getBonusesPageNames:string[] = readdirSync('./content/bonus');
  const getStaticPageNames:string[] = readdirSync('./content/static');
  const getQuestionsPageNames:string[] = readdirSync('./content/question');

  const getContentFileNames = (filesArr: string[]):string[] => {
    const withoutExtension = filesArr.map((filename) => filename.split('.')[0]);
    const withoutLocale = withoutExtension.map((filename) => filename.split('-').slice(1).join('-'));
    const uniqueNames:string[] = [];
    withoutLocale.forEach((filename) => {
      if (!uniqueNames.includes(filename)) uniqueNames.push(filename);
    });
    return uniqueNames;
  };

  const changeDate = new Date().toISOString();

  const createLocalesLinks = (url: string):{ lang:string, url: string }[] => {
    const linksArr:{ lang:string, url: string }[] = [];
    localesResponse.data.forEach((locale) => {
      linksArr.push({
        lang: locale.code,
        url: locale.isDefault ? url : `/${locale.code}${url}`,
      });
    });
    return linksArr;
  };

  const pushItem = (nativeLink: string):void => {
    const localeLinks = createLocalesLinks(nativeLink);
    localesResponse.data.forEach((locale) => {
      mapPages.push({
        url: locale.isDefault ? nativeLink : `/${locale.code}${nativeLink}`,
        lastmod: changeDate,
        links: localeLinks,
      });
    });
  };

  const addMapData = (page: NuxtPage):void => {
    if (page.children?.length) {
      page.children.forEach((child) => {
        addMapData({ ...child, path: `${page.path}/${child.path}` });
      });
      return;
    }

    if (page.name === 'bonus-pageUrl') {
      const bonusesNames = getContentFileNames(getBonusesPageNames);
      bonusesNames.forEach((bonusName) => {
        const linkUrl = page.path.replace(':pageUrl', bonusName);
        pushItem(linkUrl);
      });
    } else if (page.name === 'games-id') {
      gamesIdentities.forEach((gameIdentity) => {
        const linkUrl = page.path.replace(':id', gameIdentity);
        pushItem(linkUrl);
      });
    } else if (page.name === 'static-pageUrl') {
      const staticNames = getContentFileNames(getStaticPageNames);
      staticNames.forEach((staticName) => {
        const linkUrl = page.path.replace(':pageUrl', staticName);
        pushItem(linkUrl);
      });
    } else if (page.name === 'questions-pageUrl') {
      const questionsNames = getContentFileNames(getQuestionsPageNames);
      questionsNames.forEach((questionName) => {
        const linkUrl = page.path.replace(':pageUrl', questionName);
        pushItem(linkUrl);
      });
    } else if (page.name === 'games') {
      collectionsResponse.data.forEach((collection) => {
        if (!collection.isHidden) {
          const linkUrl = `${page.path}?category=${collection.identity}`;
          pushItem(linkUrl);
        }
      });
    } else {
      pushItem(page.path);
    }
  };

  const hidePages = [
    'betting',
    'slug',
    'password-reset-resetCode',
    'verify-confirmCode',
    'profile',
    'favorites',
    'recently-played',
  ];

  nuxt.hook('pages:extend', (pages: NuxtPage[]) => {
    if (hookRan) return;

    hookRan = true;
    pages.forEach((page) => {
      if (page.name && hidePages.includes(page.name)) return;
      addMapData(page);
    });
    const sitemap = new SitemapStream({ hostname: baseUrl });

    const writeStream = createWriteStream('./public/sitemap.xml');
    sitemap.pipe(writeStream);

    mapPages.forEach((item: any) => {
      sitemap.write(item);
    });

    sitemap.end();
  });
};
