import { getLocalesContentData } from '@skeleton/helpers/contentMethods';
import { setPageMeta } from '@skeleton/helpers/transformDomMethods';

interface IContentParams {
  contentKey: string;
  contentRoute: string[];
  where?: unknown[];
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
    let currentLocaleQuery: any = queryCollection('content').path(`${currentLocale.value?.code as string}/${params.contentRoute.join('/')}`);
    let defaultLocaleQuery: any = params.currentOnly
      ? undefined
      : queryCollection('content').path(`${defaultLocale.value?.code as string}/${params.contentRoute.join('/')}`);

    if (params.only) {
      currentLocaleQuery = currentLocaleQuery.select(...params.only);
      if (!params.currentOnly) defaultLocaleQuery = defaultLocaleQuery.select(...params.only);
    }

    if (params.where) {
      currentLocaleQuery = currentLocaleQuery.where(...params.where);
      if (!params.currentOnly) defaultLocaleQuery = defaultLocaleQuery.where(...params.where);
    }

    if (params.findAll) {
      return params.currentOnly
        ? [currentLocaleQuery.all(), undefined]
        : [
            currentLocaleQuery.all(),
            currentLocale.value?.isDefault
              ? Promise.reject('Current locale is default locale!')
              : defaultLocaleQuery.all(),
          ];
    }

    return params.currentOnly
      ? [currentLocaleQuery.first(), undefined]
      : [
          currentLocaleQuery.first(),
          currentLocale.value?.isDefault
            ? Promise.reject('Current locale is default locale!')
            : defaultLocaleQuery.first(),
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
