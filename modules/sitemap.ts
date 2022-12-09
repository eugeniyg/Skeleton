import { NuxtPage } from '@nuxt/schema';
import { $fetch } from 'ofetch';
import { GamesResponseInterface } from '@platform/frontend-core/dist/module';

const { createWriteStream, readdirSync } = require('fs');
const { SitemapStream } = require('sitemap');

export default async (inlineOptions:any, nuxt:any) => {
  if (process.env.NODE_ENV === 'development') return;
  const mapPages: any = [];

  console.log(process.env);
  const baseUrl = process.env.API_BASE_URL;
  // const localesResponse: { data: LocaleInterface[] } = await $fetch(`${baseUrl}/api/settings/locales`);
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
  const baseDataObj = {
    url: '',
    changefreq: 'daily',
    priority: 0.8,
    lastmod: changeDate,
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
        mapPages.push({ ...baseDataObj, url: page.path.replace(':pageUrl', bonusName) });
      });
    } else if (page.name === 'games-id') {
      gamesIdentities.forEach((gameIdentity) => {
        mapPages.push({ ...baseDataObj, url: page.path.replace(':id', gameIdentity) });
      });
    } else if (page.name === 'static-pageUrl') {
      const staticNames = getContentFileNames(getStaticPageNames);
      staticNames.forEach((staticName) => {
        mapPages.push({ ...baseDataObj, url: page.path.replace(':pageUrl', staticName) });
      });
    } else if (page.name === 'questions-pageUrl') {
      const questionsNames = getContentFileNames(getQuestionsPageNames);
      questionsNames.forEach((questionName) => {
        mapPages.push({ ...baseDataObj, url: page.path.replace(':pageUrl', questionName) });
      });
    } else {
      mapPages.push({ ...baseDataObj, url: page.path });
    }
  };

  nuxt.hook('pages:extend', (pages: NuxtPage[]) => {
    const hidePages = ['slug', 'password-reset-resetCode', 'verify-confirmCode'];
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
