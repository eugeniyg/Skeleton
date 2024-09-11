<template>
  <div>
    <main-slider :style="sliderVisibilityStyle"/>
    
    <nav-category
      @clickCategory="changeCategory"
    />
    
    <client-only>
      <modal-providers
        :selected="selectedProviders"
        @select="changeProvider"
      />
      <modal-categories
        @click-category="changeCategory"
      />
    </client-only>
    
    <group-games
      v-for="category in mainCategoriesList.slice(0, 3)"
      showAllBtn
      showArrows
      :category="category"
    />
    
    <group-providers showArrows/>
    
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
  import type { ICollection, IGame, IGamesResponse, IPaginationMeta } from '@skeleton/core/types';
  
  const globalStore = useGlobalStore();
  const profileStore = useProfileStore();
  const {
    currentLocale,
    defaultLocale,
    popupsData,
    defaultLocalePopupsData
  } = storeToRefs(globalStore);
  const {
    localizePath,
    setPageMeta,
    getLocalesContentData,
    getContent,
  } = useProjectMethods();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { globalComponentsContent } = globalStore;
  const layoutStore = useLayoutStore()
  const { closeModal } = layoutStore;
  const { modals } = storeToRefs(layoutStore);
  
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
  };
  
  const getPageContent = async (): Promise<IPageContent> => {
    const nuxtContentData = useNuxtData('casinoPageContent');
    if (nuxtContentData.data.value) return nuxtContentData.data.value;
    
    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'pages', 'casino')
        .findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'pages', 'casino')
          .findOne()
    ]);
    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  };
  
  const { data } = await useLazyAsyncData('casinoPageContent', () => getPageContent());
  if (data.value) setContentData(data.value);
  
  watch(data, () => {
    setContentData(data.value);
  });
  
  const { getCollectionsList } = useGamesStore();
  const { data: gameCollections } = await useLazyAsyncData(() => getCollectionsList(), { server: false });
  const mainCategoriesList = computed(() => {
    return gameCollections.value?.reduce((categoriesArr: ICollection[], currentCategory) => {
      return currentCategory.isHidden ? categoriesArr : [...categoriesArr, currentCategory];
    }, []) || [];
  });
  
  const router = useRouter();
  const changeCategory = (categoryId: string) => {
    if (modals.value.categories) closeModal('categories');
    
    router.push({
      path: localizePath('/games'),
      query: { category: categoryId }
    });
  };
  
  const selectedProviders = ref<string[]>([]);
  const sliderVisibilityHidden = ref<boolean>(false);
  
  const sliderVisibilityStyle = computed(() => {
    return { visibility: !sliderVisibilityHidden.value ? 'visible' : 'hidden' };
  });
  
  const changeProvider = async (newSelectedProviders: string[]) => {
    selectedProviders.value = newSelectedProviders;
    sliderVisibilityHidden.value = true;
    
    setTimeout(() => {
      closeModal('providers');
      router.push({
        path: localizePath('/games'),
        query: {
          category: getContent(popupsData, defaultLocalePopupsData, 'providers.collectionId'),
          provider: selectedProviders.value
        }
      });
    }, 600);
  };
</script>
