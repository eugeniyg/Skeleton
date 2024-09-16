interface IContentParams {
  contentKey: string;
  contentRoute: string[];
  isPage?: boolean;
  where?: Record<string, any>;
  only?: string[];
  findAll?: boolean;
}

export async function useContentLogic<T extends Record<string, any>>(params: IContentParams) {
  interface IPageContent {
    currentLocaleData: Maybe<T>;
    defaultLocaleData: Maybe<T>;
  }

  const globalStore = useGlobalStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);
  const { setPageMeta, getLocalesContentData } = useProjectMethods();

  const currentLocaleContent = ref<Maybe<T>>();
  const defaultLocaleContent = ref<Maybe<T>>();

  const setContentData = (contentData: Maybe<IPageContent>): void => {
    currentLocaleContent.value = contentData?.currentLocaleData;
    defaultLocaleContent.value = contentData?.defaultLocaleData;
    if (params.isPage) setPageMeta(currentLocaleContent.value?.pageMeta);
  };

  const getRequestArray = (): Promise<any>[] => {
    let currentLocaleQuery = queryContent(currentLocale.value?.code as string, ...params.contentRoute);
    let defaultLocaleQuery = queryContent(defaultLocale.value?.code as string, ...params.contentRoute);
    const currentIsDefaultPromise = Promise.reject('Current locale is default locale!');

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
        currentLocale.value?.isDefault ? currentIsDefaultPromise : defaultLocaleQuery.find()
      ]
    }

    return [
      currentLocaleQuery.findOne(),
      currentLocale.value?.isDefault ? currentIsDefaultPromise : defaultLocaleQuery.findOne()
    ]
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const nuxtContentData = useNuxtData(params.contentKey);
    if (nuxtContentData.data.value) return nuxtContentData.data.value;

    const [
      currentLocaleContentResponse,
      defaultLocaleContentResponse
    ] = await Promise.allSettled(getRequestArray());

    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  };

  const {
    error,
    status,
    data
  } = await useLazyAsyncData(params.contentKey, () => getPageContent());

  watch(data, (newValue) => {
    if (newValue) setContentData(newValue);
  }, { immediate: true });

  watch(error, (newValue) => {
    if (newValue) throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
  }, { immediate: true });

  return {
    currentLocaleContent,
    defaultLocaleContent,
    status,
    error
  }
}