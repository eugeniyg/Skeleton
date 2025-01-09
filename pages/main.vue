<template>
  <div>
    <main-slider :style="sliderVisibilityStyle" />

    <nav-category @click-category="changeCategory" />

    <client-only>
      <modal-providers :selected="selectedProviders" @select="changeProvider" />
    </client-only>

    <group-games
      v-for="category in mainCategoriesList.slice(0, 3)"
      :key="category.id"
      show-all-btn
      show-arrows
      :category="category"
    />

    <group-providers show-arrows show-all-btn />

    <group-games
      v-for="category in mainCategoriesList.slice(3, 4)"
      :key="category.id"
      show-all-btn
      show-arrows
      :category="category"
    />

    <group-winners v-if="globalComponentsContent?.cardsGroup?.latestWinners?.display" show-arrows />

    <group-games
      v-for="category in mainCategoriesList.slice(4)"
      :key="category.id"
      show-all-btn
      show-arrows
      :category="category"
    />

    <client-only>
      <favorite-recently v-if="isLoggedIn" />
    </client-only>

    <atomic-seo-text
      v-if="pageContent?.currentLocaleData?.pageMeta?.seoText"
      v-bind="pageContent.currentLocaleData.pageMeta.seoText"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { ICasinoPage } from '~/types';
  import type { ICollection } from '@skeleton/core/types';

  const globalStore = useGlobalStore();
  const profileStore = useProfileStore();
  const { localizePath, getContent } = useProjectMethods();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = globalStore;
  const layoutStore = useLayoutStore();
  const { closeModal } = layoutStore;

  const contentParams = {
    contentKey: 'casinoPageContent',
    contentRoute: ['pages', 'casino'],
    isPage: true,
  };
  const { getContentData } = useContentLogic<ICasinoPage>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(getContentData);

  const { getCollectionsList, getProviderList } = useGamesStore();
  const { data: gameCollections } = await useLazyAsyncData(() => getCollectionsList(), { server: false });
  const mainCategoriesList = computed(() => {
    return (
      gameCollections.value?.reduce((categoriesArr: ICollection[], currentCategory) => {
        return currentCategory.isHidden ? categoriesArr : [...categoriesArr, currentCategory];
      }, []) || []
    );
  });

  const router = useRouter();
  const changeCategory = async (categoryIdentity: string): Promise<void> => {
    await router.push(localizePath(`/categories/${categoryIdentity}`));
  };

  const selectedProviders = ref<string[]>([]);
  const sliderVisibilityHidden = ref<boolean>(false);

  const sliderVisibilityStyle = computed(() => {
    return { visibility: !sliderVisibilityHidden.value ? 'visible' : 'hidden' };
  });

  const changeProvider = async (newSelectedProviders: string[]) => {
    selectedProviders.value = newSelectedProviders;
    sliderVisibilityHidden.value = true;

    const gameProviders = await getProviderList();
    const providersIdentity = gameProviders
      .filter(provider => newSelectedProviders.includes(provider.id))
      .map(provider => provider.identity);

    const defaultCategory = getContent(
      globalComponentsContent,
      defaultLocaleGlobalComponentsContent,
      'providersSettings.defaultCategory'
    );

    setTimeout(() => {
      closeModal('providers');
      router.push({
        path: localizePath(defaultCategory ? `/categories/${defaultCategory}` : '/categories'),
        query: {
          provider: providersIdentity,
        },
      });
    }, 600);
  };
</script>
