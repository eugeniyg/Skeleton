interface IContentParams {
  contentKey: string;
  contentRoute: string[];
  where?: Record<string, any>;
  isPage?: boolean;
  only?: string[];
  findAll?: boolean;
}

export function useNewContentLogic<T extends Record<string, any>>(params: IContentParams) {
  interface IPageContent {
    currentLocaleData: Maybe<T>;
    defaultLocaleData: Maybe<T>;
  }

  const globalStore = useGlobalStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);
  const { setPageMeta, getLocalesContentData } = useProjectMethods();


  const getRequestArray = (): Promise<any>[] => {
    let currentLocaleQuery = queryContent(currentLocale.value?.code as string, ...params.contentRoute);
    let defaultLocaleQuery = queryContent(defaultLocale.value?.code as string, ...params.contentRoute);

    if (params.only) {
      currentLocaleQuery = currentLocaleQuery.only(params.only);
      defaultLocaleQuery = defaultLocaleQuery.only(params.only);
    }

    if (params.where) {
      currentLocaleQuery = currentLocaleQuery.where(params.where);
      defaultLocaleQuery = defaultLocaleQuery.where(params.where);
    }

    if (params.findAll) {
      return [
        currentLocaleQuery.find(),
        currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!') : defaultLocaleQuery.find()
      ]
    }

    return [
      currentLocaleQuery.findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!') : defaultLocaleQuery.findOne()
    ]
  }

  const getContentData = async (): Promise<IPageContent> => {
    let contentData: IPageContent = { currentLocaleData: undefined, defaultLocaleData: undefined };
    const nuxtContentData = useNuxtData(params.contentKey);

    if (nuxtContentData.data.value) contentData = nuxtContentData.data.value;
    else {
      const [
        currentLocaleContentResponse,
        defaultLocaleContentResponse
      ] = await Promise.allSettled(getRequestArray());
      contentData = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
    }

    if (params.isPage) setPageMeta(contentData.currentLocaleData?.pageMeta);
    return contentData;
  };

  return { getContentData };
}