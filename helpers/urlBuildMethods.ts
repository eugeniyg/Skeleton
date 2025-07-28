import type { IGameImages, IGameProvider } from '@skeleton/api/types';

export const createSrcSet = (src?: string): string => {
  if (!src) return '';

  const webpSrc = src.replace(/\.\w+$/, '.webp');
  return `${webpSrc}, ${src}`;
};

export const getGameImageUrl = (
  customImages: Maybe<IGameImages>,
  images: Maybe<IGameImages>,
  orientation: string
): string => {
  let imageUrl: string | undefined;
  const { public: config } = useRuntimeConfig();

  if (customImages) {
    const imagePath =
      orientation === 'vertical'
        ? customImages['200x300']?.['3x'] || customImages['200x300']?.['2x'] || customImages['200x300']?.['1x']
        : customImages['200x200']?.['3x'] || customImages['200x200']?.['2x'] || customImages['200x200']?.['1x'];
    if (imagePath && config.customerCdn) imageUrl = `${config.customerCdn}${imagePath}`;
  }

  if (!imageUrl && images) {
    const imagePath =
      orientation === 'vertical'
        ? images['200x300']?.['3x'] || images['200x300']?.['2x'] || images['200x300']?.['1x']
        : images['200x200']?.['3x'] || images['200x200']?.['2x'] || images['200x200']?.['1x'];
    if (imagePath && config.gamehubCdn) imageUrl = `${config.gamehubCdn}${imagePath}`;
  }

  if (imageUrl) return imageUrl;

  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = useGlobalStore();
  const verticalDefaultThumb =
    getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'defaultGameThumbs.vertical') ||
    '/img/vertical-game-thumb.png';
  const squareDefaultThumb =
    getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'defaultGameThumbs.square') ||
    '/img/square-game-thumb.png';
  return orientation === 'vertical' ? verticalDefaultThumb : squareDefaultThumb;
};

export const getProviderImageUrl = (providerData: IGameProvider | undefined): string => {
  const { public: config } = useRuntimeConfig();

  if (providerData?.customImages?.['116x40'] && config.customerCdn) {
    const mainPath =
      providerData?.customImages['116x40']?.['3x'] ||
      providerData?.customImages['116x40']?.['2x'] ||
      providerData?.customImages['116x40']['1x'];
    return `${config.customerCdn}${mainPath}`;
  }

  if (providerData?.images?.['116x40'] && config.gamehubCdn) {
    const mainPath =
      providerData?.images['116x40']?.['3x'] ||
      providerData?.images['116x40']?.['2x'] ||
      providerData?.images['116x40']['1x'];
    return `${config.gamehubCdn}${mainPath}`;
  }

  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = useGlobalStore();
  return (
    getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'providersSettings.defaultLogo') ||
    '/img/provider-empty-placeholder.svg'
  );
};
