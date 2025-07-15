import { getLocalesContentData } from '@skeleton/helpers/contentMethods';
import { setPageMeta } from '@skeleton/helpers/transformDomMethods';

interface IContentParams {
  contentKey: string;
  contentRoute: string[];
  where?: Record<string, any>;
  isPage?: boolean;
  only?: string[];
  findAll?: boolean;
  currentOnly?: boolean;
}

export function useContentLogic<T extends Record<string, any>>(params: IContentParams) {
  interface IPageContent {
    currentLocaleData: Maybe<T>;
    defaultLocaleData: Maybe<T>;
  }

  const globalStore = useGlobalStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);

  const getRequestArray = (): Promise<any>[] => {
    let currentLocaleQuery: any = queryContent(currentLocale.value?.code as string, ...params.contentRoute);
    let defaultLocaleQuery: any = params.currentOnly
      ? undefined
      : queryContent(defaultLocale.value?.code as string, ...params.contentRoute);

    if (params.only) {
      currentLocaleQuery = currentLocaleQuery.only(params.only);
      if (!params.currentOnly) defaultLocaleQuery = defaultLocaleQuery.only(params.only);
    }

    if (params.where) {
      currentLocaleQuery = currentLocaleQuery.where(params.where);
      if (!params.currentOnly) defaultLocaleQuery = defaultLocaleQuery.where(params.where);
    }

    if (params.findAll) {
      return params.currentOnly
        ? [currentLocaleQuery.find(), undefined]
        : [
            currentLocaleQuery.find(),
            currentLocale.value?.isDefault
              ? Promise.reject('Current locale is default locale!')
              : defaultLocaleQuery.find(),
          ];
    }

    return params.currentOnly
      ? [currentLocaleQuery.findOne(), undefined]
      : [
          currentLocaleQuery.findOne(),
          currentLocale.value?.isDefault
            ? Promise.reject('Current locale is default locale!')
            : defaultLocaleQuery.findOne(),
        ];
  };

  const getContentData = async (): Promise<IPageContent> => {
    let contentData: IPageContent = { currentLocaleData: undefined, defaultLocaleData: undefined };
    const { data: nuxtDataContent } = useNuxtData(params.contentKey);

    if (nuxtDataContent.value) contentData = nuxtDataContent.value;
    else {
      const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled(getRequestArray());
      contentData = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
      nuxtDataContent.value = contentData;
    }

    if (params.isPage) setPageMeta(contentData.currentLocaleData?.pageMeta);
    return contentData;
  };

  return { getContentData };
}
