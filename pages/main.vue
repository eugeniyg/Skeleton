<template>
  <div>
    <main-slider :style="sliderVisibilityStyle" />
    <nav-category @click-category="changeCategory" @openProviders="openProviders" />

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
  import type { ICasinoPage } from '~/types';
  import type { ICollection } from '@skeleton/api/types';

  const globalStore = useGlobalStore();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = globalStore;
  const { openModal, closeModal } = useModalStore();

  const contentParams = {
    contentKey: 'casinoPageContent',
    contentCollection: 'pages',
    contentSource: 'casino',
    isPage: true,
  };
  const { getContentData } = useContentLogic<ICasinoPage>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(getContentData);

  const { gameProviders, collectionsByCountry } = useGamesStore();
  const mainCategoriesList =
    collectionsByCountry.reduce((categoriesArr: ICollection[], currentCategory) => {
      return currentCategory.isHidden ? categoriesArr : [...categoriesArr, currentCategory];
    }, []) || [];

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

    const providersIdentity = gameProviders
      .filter(provider => newSelectedProviders.includes(provider.id))
      .map(provider => provider.identity);

    const defaultCategory = getContent(
      globalComponentsContent,
      defaultLocaleGlobalComponentsContent,
      'providersSettings.defaultCategory'
    );

    await closeModal('providers');
    await router.push({
      path: localizePath(defaultCategory ? `/categories/${defaultCategory}` : '/categories'),
      query: {
        provider: providersIdentity,
      },
    });
  };

  const openProviders = () => {
    openModal('providers', { props: { selected: selectedProviders, onSelect: changeProvider } });
  };
</script>
