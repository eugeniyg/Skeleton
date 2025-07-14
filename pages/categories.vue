<template>
  <not-found v-if="state.showNotFound" />

  <div v-else class="categories">
    <atomic-cat-heading v-if="state.currentCategory" :icon="gameCategoriesObj[state.currentCategory.identity]?.icon">
      {{ gameCategoriesObj[state.currentCategory.identity]?.label || state.currentCategory?.name }}
    </atomic-cat-heading>

    <div v-click-outside="skipActionsState" class="game-filter">
      <nav-category hide-items @click-category="changeCategory" @openProviders="openProviders" />

      <form-input-search
        v-model:value="state.searchValue"
        class="game-filter__search"
        :placeholder="getContent(layoutData, defaultLocaleLayoutData, 'header.search.placeholder')"
        @input="searchInput"
      />

      <button-toggle-filter :is-active="state.isShowFilter" @toggle="toggleFilter" />

      <atomic-game-sort
        v-show="state.isShowFilter"
        v-if="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'sortOptions')?.length"
        class="game-filter__sort"
        :sortOrderValue="state.sortOrder"
        :sortByValue="state.sortBy"
        :sortLabel="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'sortLabel')"
        :sortOptions="sortOptions"
        @change="changeSort"
      />

      <providers-tags
        v-if="tags.length"
        :tags="tags"
        :clearLabel="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'clearProviders')"
        @unselect="selectProviders"
      />
    </div>

    <list-grid v-if="state.pageData.length" :items="state.pageData" :meta="state.pageMeta" @load-more="getData(true)" />

    <atomic-empty
      v-else-if="!state.loadingGames"
      :title="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.title')"
      :sub-title="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.description')"
      :image="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'empty.image')"
    />

    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
  import type { ICollection, IGame, IGameProvider, IPaginationMeta } from '@skeleton/api/types';
  import type { ICategoryPage } from '~/types';
  import debounce from 'lodash/debounce';
  import { getFilteredGames } from '@skeleton/api/games';

  definePageMeta({
    middleware: async function (to) {
      if (to.params.categoryIdentity) return;

      const { collectionsByCountry } = useGamesStore();
      if (!collectionsByCountry.length) return;
      const { localizePath } = useProjectMethods();
      return navigateTo({
        path: localizePath(`/categories/${collectionsByCountry[0].identity}`),
        query: { ...to.query },
      });
    },
  });

  const globalStore = useGlobalStore();
  const { gameCategoriesObj, layoutData, defaultLocaleLayoutData, headerCountry, isMobile } = storeToRefs(globalStore);
  const { getContent, localizePath } = useProjectMethods();
  const route = useRoute();
  const router = useRouter();
  const { openModal, closeModal } = useModalStore();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { gameProviders, collectionsByCountry } = useGamesStore();

  const contentParams = {
    contentKey: 'categoryPageContent',
    contentRoute: ['pages', 'category'],
  };
  const { getContentData } = useContentLogic<ICategoryPage>(contentParams);
  const { data: pageContent, status: contentStatus } = await useLazyAsyncData(getContentData);

  interface IState {
    showNotFound: boolean;
    sortBy: string;
    sortOrder: string;
    providerIds: string[];
    currentCategory: ICollection | undefined;
    searchValue: string;
    isShowFilter: boolean;
    loadingGames: boolean;
    pageData: IGame[];
    pageMeta: IPaginationMeta | undefined;
  }

  const state = reactive<IState>({
    showNotFound: false,
    sortBy: '',
    sortOrder: '',
    providerIds: [],
    currentCategory: undefined,
    searchValue: '',
    isShowFilter: false,
    loadingGames: true,
    pageData: [],
    pageMeta: undefined,
  });

  const getData = async (nextPage: boolean): Promise<void> => {
    state.loadingGames = true;

    const params: any = {
      page: nextPage ? (state.pageMeta?.page || 0) + 1 : 1,
      perPage: isMobile.value && window.innerHeight < 1000 ? 24 : 72,
      name: state.searchValue || undefined,
      collectionId: state.currentCategory?.id,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder,
      countries: headerCountry.value ? [headerCountry.value] : undefined,
      providerId: state.providerIds,
    };

    try {
      const { data, meta } = await getFilteredGames(params);
      state.pageData = nextPage ? state.pageData.concat(data) : data;
      state.pageMeta = meta;
    } catch {
      state.pageData = [];
      state.pageMeta = undefined;
    } finally {
      state.showNotFound = false;
    }

    state.loadingGames = false;
  };

  const changeCategory = async (categoryIdentity: string): Promise<void> => {
    if (route.params.categoryIdentity === categoryIdentity) return;
    await router.push(localizePath(`/categories/${categoryIdentity}`));
  };

  const changeSort = async (...args: any): Promise<void> => {
    const [by, order] = args;
    state.sortBy = by;
    state.sortOrder = order;
    await router.push({ query: { ...route.query, sortBy: by, sortOrder: order } });
    await getData(false);
  };

  const tags = ref<IGameProvider[]>([]);
  const selectProviders = async (providersIds: string[]) => {
    await closeModal('providers');
    const selectedProvidersData = gameProviders.filter(
      provider => providersIds.includes(provider.id) && !!provider.gameEnabledCount
    );
    tags.value = selectedProvidersData;
    state.providerIds = selectedProvidersData.map(provider => provider.id);
    const providerIdentities = selectedProvidersData.map(provider => provider.identity);
    await router.push({ query: { ...route.query, provider: providerIdentities } });
    await getData(false);
  };

  const toggleFilter = () => {
    state.isShowFilter = !state.isShowFilter;
  };

  const skipActionsState = () => {
    state.isShowFilter = false;
  };

  const searchInput = debounce(
    async (): Promise<void> => {
      if (state.searchValue.length > 1 || !state.searchValue) {
        await getData(false);
      }
    },
    500,
    { leading: false }
  );

  const sortOptions = computed(() => {
    const optionsContent: ICategoryPage['sortOptions'] =
      getContent(pageContent.value?.currentLocaleData, pageContent.value?.defaultLocaleData, 'sortOptions') || [];

    const filteredOptions: ICategoryPage['sortOptions'] = [];
    optionsContent.forEach(option => {
      if (option.sortBy !== 'score' || isLoggedIn.value) filteredOptions.push(option);
    });
    return filteredOptions;
  });

  const setDefaultSort = (): void => {
    const routeSortBy = route.query.sortBy as string;
    const findSortOption = sortOptions.value.find(option => option.sortBy === routeSortBy);
    state.sortBy = findSortOption?.sortBy || sortOptions.value[0].sortBy || 'score';
    state.sortOrder = findSortOption?.sortOrder || sortOptions.value[0].sortOrder || 'asc';
  };

  const resetFilters = (): void => {
    state.searchValue = '';
    setDefaultSort();
  };

  const setProviders = (): void => {
    const routerProviders = route.query.provider;
    const providersIdentities = Array.isArray(routerProviders) ? routerProviders : [routerProviders];

    const selectedProvidersData = gameProviders.filter(
      provider => providersIdentities.includes(provider.identity) && !!provider.gameEnabledCount
    );
    tags.value = selectedProvidersData;
    state.providerIds = selectedProvidersData.map(provider => provider.id);
  };

  const loadCategoryData = async () => {
    resetFilters();
    setProviders();

    state.currentCategory = collectionsByCountry.find(category => category.identity === route.params.categoryIdentity);
    if (!state.currentCategory) {
      state.showNotFound = true;
      return;
    }

    await getData(false);
  };

  const openProviders = () => {
    openModal('providers', { props: { selected: state.providerIds, onSelect: selectProviders } });
  };

  watch(
    () => route.params.categoryIdentity,
    async () => {
      await loadCategoryData();
    }
  );

  watch(isLoggedIn, async newValue => {
    if (newValue) await loadCategoryData();
  });

  onMounted(() => {
    watch(
      contentStatus,
      async newValue => {
        if (newValue && ['success', 'error'].includes(newValue)) await loadCategoryData();
      },
      { immediate: true }
    );
  });
</script>

<style src="~/assets/styles/pages/categories.scss" lang="scss" />
