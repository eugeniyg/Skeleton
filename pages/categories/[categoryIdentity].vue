<template>
  <div>
    <atomic-seo-text v-if="pageSeoText" v-bind="pageSeoText" />
  </div>
</template>

<script setup lang="ts">
  import type { ICategoryPage, IPageMeta } from '~/types';
  import type { IGameProvider } from '@skeleton/api/types';
  import { getProviderImageUrl } from '@skeleton/helpers/urlBuildMethods';
  import { setPageMeta } from '@skeleton/helpers/transformDomMethods';

  const contentParams = {
    contentKey: 'categoryPageContent',
    contentCollection: 'pages',
    contentSource: 'category',
  };

  const route = useRoute();
  const { getContentData } = useContentLogic<ICategoryPage>(contentParams);
  const { data: pageContent, status: contentStatus } = await useLazyAsyncData(getContentData);

  const { gameProviders, collectionsByCountry } = useGamesStore();

  const getCategoryName = (): string => {
    const categoryIdentity = route.params.categoryIdentity as string;
    return collectionsByCountry.find(collection => collection.identity === categoryIdentity)?.name ?? '';
  };

  const getCategoryMeta = (): IPageMeta => {
    const categoryMetaContent = pageContent.value?.currentLocaleData?.categoryPageMeta;
    if (!categoryMetaContent) return {};

    const currentCategoryName = getCategoryName();

    return {
      ...categoryMetaContent,
      title: categoryMetaContent.title
        ? categoryMetaContent.title.replace('{category}', currentCategoryName)
        : undefined,
      description: categoryMetaContent.description
        ? categoryMetaContent.description.replace('{category}', currentCategoryName)
        : undefined,
    };
  };

  const getProviderMeta = (providerData: IGameProvider): IPageMeta => {
    const providerMetaContent = pageContent.value?.currentLocaleData?.providerPageMeta;
    if (!providerMetaContent) return {};

    const providerName = providerData.name;
    const categoryName = getCategoryName();
    const providerImage = getProviderImageUrl(providerData);
    const requestUrl = useRequestURL();

    return {
      ...providerMetaContent,
      title: providerMetaContent.title
        ? providerMetaContent.title.replace('{category}', categoryName).replace('{provider}', providerName)
        : undefined,
      description: providerMetaContent.description
        ? providerMetaContent.description.replace('{category}', categoryName).replace('{provider}', providerName)
        : undefined,
      image: providerImage,
      canonicalUrl: `${requestUrl.origin}${route.fullPath}`,
    };
  };

  const getProviderData = (): IGameProvider | undefined => {
    const providerIdentities = route.query.provider;
    if (providerIdentities && typeof providerIdentities === 'string') {
      return gameProviders.find(provider => provider.identity === providerIdentities);
    }
    if (providerIdentities && Array.isArray(providerIdentities) && providerIdentities.length === 1) {
      return gameProviders.find(provider => provider.identity === providerIdentities[0]);
    }
    return undefined;
  };

  const changePageMeta = (): void => {
    if (!pageContent.value) return;
    const providerData = getProviderData();

    if (providerData) setPageMeta(getProviderMeta(providerData));
    else setPageMeta(getCategoryMeta());
  };

  if (import.meta.server && pageContent.value) changePageMeta();
  watch(contentStatus, newValue => {
    if (newValue === 'success') changePageMeta();
  });
  watch(() => route.query.provider, changePageMeta);

  const pageSeoText = computed(() => {
    if (!pageContent.value) return undefined;

    const providerSeoText = pageContent.value?.currentLocaleData?.providerPageMeta?.seoText;
    const categorySeoText = pageContent.value?.currentLocaleData?.categoryPageMeta?.seoText;
    const providerData = getProviderData();
    const categoryName = getCategoryName();

    if (providerData && providerSeoText) {
      return {
        ...providerSeoText,
        visible: providerSeoText.visible
          ? providerSeoText.visible.replace('{category}', categoryName).replace('{provider}', providerData.name)
          : undefined,
        hidden: providerSeoText.hidden
          ? providerSeoText.hidden.replace('{category}', categoryName).replace('{provider}', providerData.name)
          : undefined,
      };
    }

    if (categorySeoText) {
      return {
        ...categorySeoText,
        visible: categorySeoText.visible ? categorySeoText.visible.replace('{category}', categoryName) : undefined,
        hidden: categorySeoText.hidden ? categorySeoText.hidden.replace('{category}', categoryName) : undefined,
      };
    }

    return undefined;
  });
</script>
