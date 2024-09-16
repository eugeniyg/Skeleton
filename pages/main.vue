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
      :key="category.id"
      showAllBtn
      showArrows
      :category="category"
    />
    
    <group-providers showArrows/>
    
    <group-games
      v-for="category in mainCategoriesList.slice(3, 4)"
      :key="category.id"
      showAllBtn
      showArrows
      :category="category"
    />
    
    <group-winners v-if="globalComponentsContent?.cardsGroup?.latestWinners?.display" showArrows/>
    
    <group-games
      v-for="category in mainCategoriesList.slice(4)"
      :key="category.id"
      showAllBtn
      showArrows
      :category="category"
    />
    
    <client-only>
      <favorite-recently v-if="isLoggedIn"/>
    </client-only>
    
    <atomic-seo-text v-if="currentLocaleContent?.pageMeta?.seoText" v-bind="currentLocaleContent.pageMeta.seoText" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { ICasinoPage } from '~/types';
  import type { ICollection } from '@skeleton/core/types';
  
  const globalStore = useGlobalStore();
  const profileStore = useProfileStore();
  const { popupsData, defaultLocalePopupsData } = storeToRefs(globalStore);
  const { localizePath, getContent } = useProjectMethods();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { globalComponentsContent } = globalStore;
  const layoutStore = useLayoutStore()
  const { closeModal } = layoutStore;
  const { modals } = storeToRefs(layoutStore);
  
  const { currentLocaleContent } = await useContentLogic<ICasinoPage>({
    contentKey: 'casinoPageContent',
    contentRoute: ['pages', 'casino'],
    isPage: true
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
