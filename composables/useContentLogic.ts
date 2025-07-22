import { getLocalesContentData } from '@skeleton/helpers/contentMethods';
import { setPageMeta } from '@skeleton/helpers/transformDomMethods';
import camelCase from 'lodash/camelCase';
import type { CollectionItemBase, Collections } from '@nuxt/content';
type CollectionKey = keyof Collections;

interface IContentParams {
  contentKey: string;
  contentCollection: string;
  contentSource?: string;
  where?: unknown[]; // field should be in content.config.ts schema!!!!
  isPage?: boolean;
  findAll?: boolean;
  currentOnly?: boolean;
}

export function useContentLogic<T>(params: IContentParams) {
  interface IPageContent {
    currentLocaleData: Maybe<T>;
    defaultLocaleData: Maybe<T>;
  }

  const globalStore = useGlobalStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);

  const getRequestArray = (): Promise<any>[] => {
    const currentLocaleCode = currentLocale.value?.code as string;
    const defaultLocaleCode = defaultLocale.value?.code as string;
    const currentLocaleCollectionName = camelCase(`${currentLocaleCode}-${params.contentCollection}`);
    const defaultLocaleCollectionName = camelCase(`${defaultLocaleCode}-${params.contentCollection}`);
    let currentLocaleQuery: any = queryCollection(currentLocaleCollectionName as CollectionKey);
    let defaultLocaleQuery: any = params.currentOnly
      ? undefined
      : queryCollection(defaultLocaleCollectionName as CollectionKey);

    if (params.contentSource) {
      currentLocaleQuery = currentLocaleQuery.where(
        'stem',
        '=',
        `${currentLocaleCode}/${params.contentCollection}/${params.contentSource}`
      );

      if (!params.currentOnly)
        defaultLocaleQuery = defaultLocaleQuery.where(
          'stem',
          '=',
          `${defaultLocaleCode}/${params.contentCollection}/${params.contentSource}`
        );
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
      const rawContentData = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
      if (Array.isArray(rawContentData.currentLocaleData)) {
        contentData.currentLocaleData = rawContentData.currentLocaleData.map((item: CollectionItemBase) => ({
          ...(item.meta.body as object),
          stem: item.stem,
        })) as T;
      } else if (rawContentData.currentLocaleData) {
        contentData.currentLocaleData = {
          ...rawContentData.currentLocaleData.meta.body,
          stem: rawContentData.currentLocaleData.stem,
        };
      }

      if (Array.isArray(rawContentData.defaultLocaleData)) {
        contentData.defaultLocaleData = rawContentData.defaultLocaleData.map((item: CollectionItemBase) => ({
          ...(item.meta.body as object),
          stem: item.stem,
        })) as T;
      } else if (rawContentData.defaultLocaleData) {
        contentData.defaultLocaleData = {
          ...rawContentData.defaultLocaleData.meta.body,
          stem: rawContentData.defaultLocaleData.stem,
        };
      }

      //nuxtDataContent.value = contentData;
    }

    if (params.isPage && !Array.isArray(contentData.currentLocaleData))
      // @ts-expect-error - Page Meta
      setPageMeta(contentData.currentLocaleData?.pageMeta);

    return contentData;
  };

  return { getContentData };
}
