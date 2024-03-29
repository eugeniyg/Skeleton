<template>
  <div>
    <main-slider />
    
    <nav-cat @clickCategory="changeCategory"/>
    
    <group-games
      v-for="category in mainCategoriesList.slice(0, 3)"
      showAllBtn
      showArrows
      :category="category"
    />

    <group-providers showArrows />

    <group-games
      v-for="category in mainCategoriesList.slice(3, 4)"
      showAllBtn
      showArrows
      :category="category"
    />
    
    <group-winners showArrows v-if="globalComponentsContent?.cardsGroup?.latestWinners?.display"/>
    
    <group-games
      v-for="category in mainCategoriesList.slice(4)"
      showAllBtn
      showArrows
      :category="category"
    />

    <client-only>
      <favorite-recently v-if="isLoggedIn"/>
    </client-only>

    <atomic-seo-text v-if="pageContent?.pageMeta?.seoText" v-bind="pageContent.pageMeta.seoText"/>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { ICasinoPage } from '~/types';
  import type { ICollection } from '@skeleton/core/types';

  const globalStore = useGlobalStore();
  const profileStore = useProfileStore();
  const {
    currentLocale,
    defaultLocale
  } = storeToRefs(globalStore);
  const {
    localizePath,
    setPageMeta,
    getLocalesContentData
  } = useProjectMethods();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { globalComponentsContent } = globalStore;

  const pageContent = ref<Maybe<ICasinoPage>>();
  const defaultLocalePageContent = ref<Maybe<ICasinoPage>>();

  interface IPageContent {
    currentLocaleData: Maybe<ICasinoPage>;
    defaultLocaleData: Maybe<ICasinoPage>;
  }

  const setContentData = (contentData: Maybe<IPageContent>): void => {
    pageContent.value = contentData?.currentLocaleData;
    defaultLocalePageContent.value = contentData?.defaultLocaleData;
    setPageMeta(pageContent.value?.pageMeta);
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const nuxtContentData = useNuxtData('casinoPageContent');
    if (nuxtContentData.data.value) return nuxtContentData.data.value;

    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'pages', 'casino').findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'pages', 'casino').findOne()
    ]);
    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  }

  const { data } = await useLazyAsyncData('casinoPageContent', () => getPageContent());
  if (data.value) setContentData(data.value);

  watch(data, () => {
    setContentData(data.value);
  })


  const router = useRouter();
  const gameStore = useGamesStore();
  const { currentLocationCollections } = storeToRefs(gameStore);

  const mainCategoriesList = currentLocationCollections.value.reduce((categoriesArr: ICollection[], currentCategory) => {
    return currentCategory.isHidden ? categoriesArr : [...categoriesArr, currentCategory];
  }, []);

  const changeCategory = (categoryId: string) => {
    router.push({ path: localizePath('/games'), query: { category: categoryId } });
  };
</script>
