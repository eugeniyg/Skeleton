<template>
  <div class="category">
    <nav-cat @clickCategory="changeCategory"/>

    <atomic-cat-heading
      v-if="gameCategoriesObj[activeCollection?.identity]"
      :icon="gameCategoriesObj[activeCollection?.identity].icon"
    >
      {{ gameCategoriesObj[activeCollection?.identity].label || activeCollection?.name }}
    </atomic-cat-heading>

    <div class="game-filter" v-click-outside="skipActionsState">
      <form-input-dropdown
        class="game-filter__dropdown"
        :value="currentProvider.id"
        name="providers"
        placeholder="Providers"
        :options="providerDropdownOptions"
        @input="changeProvider"
        is-fit-content
      />

      <div class="game-filter__actions">
        <button-toggle-search :is-active="isShowSearch" @toggle="toggleSearch"/>
        <button-toggle-filter :is-active="isShowFilter" @toggle="toggleFilter"/>
      </div>

      <form-input-search
        class="game-filter__search"
        v-show="isShowSearch"
        v-model:value="searchValue"
        :placeholder="getContent(layoutData, defaultLocaleLayoutData, 'header.search.placeholder')"
        @input="searchInput"
        @submit="isShowSearch = false"
      />

      <atomic-game-sort
        class="game-filter__sort"
        v-show="isShowFilter"
        v-if="getContent(gamesContent, defaultLocaleGamesContent, 'sortOptions')?.length"
        :sortOrderValue="sortOrder"
        :sortByValue="sortBy"
        @change="changeSort"
        v-bind="gamesContent?.sortOptions?.length ? gamesContent : defaultLocaleGamesContent"
      />
    </div>

    <list-grid
      v-if="gameItems.length"
      :items="gameItems"
      :meta="pageMeta"
      @loadMore="loadMoreItems"
    />

    <atomic-empty
      v-if="!gameItems.length && !loadingGames"
      :title="getContent(gamesContent, defaultLocaleGamesContent, 'empty.title')"
      :subTitle="getContent(gamesContent, defaultLocaleGamesContent, 'empty.description')"
      :image="getContent(gamesContent, defaultLocaleGamesContent, 'empty.image')"
    />

    <atomic-seo-text v-if="gamesContent?.seo?.text" v-bind="gamesContent?.seo?.text"/>
  </div>
</template>

<script setup lang="ts">
  import {
    ICollection,
    IGame,
    IGameProvider,
    IGamesResponse,
    IPaginationMeta
  } from '@skeleton/core/types';
  import {storeToRefs} from 'pinia';
  import debounce from 'lodash/debounce';
  import { IGamesPage } from '~/types';

  definePageMeta({
    middleware: 'games-collection',
  });

  const globalStore = useGlobalStore();
  const {
    gameCategoriesObj,
    layoutData,
    currentLocale,
    defaultLocale,
    defaultLocaleLayoutData,
    headerCountry
  } = storeToRefs(globalStore);

  const {
    setPageSeo,
    getContent,
    getLocalesContentData,
  } = useProjectMethods();

  const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
    useAsyncData('currentLocaleGamesPageContent', () => queryContent(currentLocale.value?.code as string, 'pages', 'games').findOne()),
    currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
      : useAsyncData('defaultLocaleGamesPageContent', () => queryContent(defaultLocale.value?.code as string, 'pages', 'games').findOne())
  ]);

  const { currentLocaleData, defaultLocaleData } = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);

  const gamesContent: Maybe<IGamesPage> = currentLocaleData;
  const defaultLocaleGamesContent: Maybe<IGamesPage> = defaultLocaleData;
  setPageSeo(gamesContent?.seo);

  const gamesStore = useGamesStore();
  const { currentLocationCollections } = storeToRefs(gamesStore);
  const { selectOptions } = useFieldsStore();
  const providerDropdownOptions: IGameProvider[] = [
    {
      id: 'all',
      name: gamesContent?.providersLabel || defaultLocaleGamesContent?.providersLabel || 'All Providers',
      identity: 'all',
      code: 'all',
      value: gamesContent?.providersLabel || defaultLocaleGamesContent?.providersLabel || 'All Providers',
    },
    ...selectOptions.providers,
  ];
  const route = useRoute();
  const router = useRouter();

  const activeCollection = ref<ICollection | undefined>(
    currentLocationCollections.value.find((collection) => collection.identity === route.query.category),
  );

  const currentProvider = ref<IGameProvider | undefined>(
    providerDropdownOptions.find(
      (provider: IGameProvider) => provider.identity === route.query.provider,
    ) || providerDropdownOptions[0],
  );

  const sortBy = ref<string | undefined>(route.query.sortBy as string
    || getContent(gamesContent, defaultLocaleGamesContent, 'sortOptions.0.sortBy') || 'default');
  const sortOrder = ref<string | undefined>(route.query.sortOrder as string
    || getContent(gamesContent, defaultLocaleGamesContent, 'sortOptions.0.sortOrder') || 'asc');
  const searchValue = ref<string>('');
  const loadPage = ref<number>(1);
  const gameItems = ref<IGame[]>([]);
  const pageMeta = ref<IPaginationMeta>();
  const loadingGames = ref<boolean>(true);
  const isShowFilter = ref<boolean>(false);
  const isShowSearch = ref<boolean>(false);

  const { getFilteredGames } = useCoreGamesApi();

  const getItems = async (): Promise<IGamesResponse> => {
    const params: any = {
      page: loadPage.value,
      perPage: 36,
      collectionId: activeCollection.value?.id,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
      countries: headerCountry.value ? [headerCountry.value] : undefined
    };

    if (currentProvider.value?.id !== 'all') {
      params.providerId = currentProvider.value?.id;
    }

    if (searchValue.value) params.name = searchValue.value;

    loadingGames.value = true;
    return await getFilteredGames(params);
  };

  const setItems = (response: IGamesResponse, more?: boolean): void => {
    gameItems.value = more
      ? gameItems.value.concat(response.data)
      : response.data;
    pageMeta.value = response.meta;
    loadingGames.value = false;
  };

  const changeProvider = async (providerId: string): Promise<void> => {
    loadPage.value = 1;

    currentProvider.value = providerDropdownOptions.find(
      (provider: IGameProvider) => provider.id === providerId,
    );

    router.replace({
      query: {
        ...route.query,
        provider:
          currentProvider.value?.id !== 'all'
            ? currentProvider.value?.identity
            : undefined,
      },
    });
    const response = await getItems();
    setItems(response);
  };

  const changeCategory = async (categoryId: string): Promise<void> => {
    loadPage.value = 1;
    activeCollection.value = currentLocationCollections.value.find(
      (collection) => collection.identity === categoryId,
    );
    router.replace({ query: { ...route.query, category: categoryId } });
    window.scroll(0, 0);
    const response = await getItems();
    setItems(response);
  };

  const changeSort = async (...args: any): Promise<void> => {
    const [by, order] = args;
    loadPage.value = 1;
    sortBy.value = by;
    sortOrder.value = order;
    router.replace({ query: { ...route.query, sortBy: by, sortOrder: order } });
    const response = await getItems();
    setItems(response);
  };

  const searchInput = debounce(async (): Promise<void> => {
    if (searchValue.value.length > 1 || !searchValue.value) {
      loadPage.value = 1;
      const response = await getItems();
      setItems(response);
    }
  }, 500, { leading: false });

  const loadMoreItems = async (): Promise<void> => {
    loadPage.value = (pageMeta.value?.page || 0) + 1;
    const response = await getItems();
    setItems(response, true);
  };

  watch(() => route.query.category as string, async (newValue: string) => {
    if ((route.name === 'games' || route.name === 'locale-games') && route.query.category !== activeCollection.value?.identity) {
      await changeCategory(newValue);
    }
  });

  onMounted(async () => {
    const itemsResponse = await getItems();
    setItems(itemsResponse);
  });

  const toggleFilter = () => {
    isShowFilter.value = !isShowFilter.value;
    isShowSearch.value = false;
  };

  const toggleSearch = () => {
    isShowSearch.value = !isShowSearch.value;
    isShowFilter.value = false;
  };

  const skipActionsState = () => {
    isShowSearch.value = false;
    isShowFilter.value = false;
  }
</script>

<style src="~/assets/styles/pages/games/index.scss" lang="scss"/>
