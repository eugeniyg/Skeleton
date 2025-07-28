import type { IPageMeta } from '~/types';

export const setPageMeta = (metaData: Maybe<IPageMeta>): void => {
  const globalStore = useGlobalStore();
  const requestUrl = useRequestURL();
  const imageContent = metaData?.image || globalStore.globalSeo?.image;
  let imageUrl: string | undefined;
  if (imageContent) {
    imageUrl = imageContent.startsWith('http') ? imageContent : `${requestUrl.origin}${imageContent}`;
  }
  const canonicalUrl = metaData?.canonicalUrl || `${requestUrl.origin}${requestUrl.pathname}`;

  useHead({
    link: [{ rel: 'canonical', href: canonicalUrl }],
  });

  useSeoMeta({
    title: metaData?.title || globalStore.globalSeo?.title,
    ogTitle: metaData?.title || globalStore.globalSeo?.title,
    description: metaData?.description || globalStore.globalSeo?.description,
    ogDescription: metaData?.description || globalStore.globalSeo?.description,
    ogImage: imageUrl,
  });
};

export const addBetsyScript = (): HTMLElement => {
  const script = document.createElement('script');
  script.setAttribute('src', 'https://turboplatform-dev.betsy.gg/assets/sdk/init.js');
  script.setAttribute('defer', 'defer');
  document.head.append(script);
  return script;
};
