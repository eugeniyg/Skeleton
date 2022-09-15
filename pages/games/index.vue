<template>
  <div class="category">
    <nav-cat @clickCategory="changeCategory" />

    <atomic-cat-heading
      v-if="gameCategoriesObj[activeCollection.identity]"
      :icon="gameCategoriesObj[activeCollection.identity].icon"
    >
      {{ gameCategoriesObj[activeCollection.identity].label || activeCollection.name }}
    </atomic-cat-heading>

    <form-input-search
      v-model:value="searchValue"
      :placeholder="headerContent?.search.placeholder"
      @input="searchInput"
    />

    <div class="filters">
      <form-dropdown-base
        :value="currentProvider.id"
        name="providers"
        placeholder="Providers"
        :options="providerDropdownOptions"
        @input="changeProvider"
      />

      <atomic-game-sort v-model:value="sortOrder" :label="gamesContent?.sortLabel" @change="changeSort"/>
    </div>

    <list-grid :items="gameItems" :meta="pageMeta" @loadMore="loadMoreItems" />

    <atomic-empty
      v-if="gameItems.length === 0"
      :title="gamesContent?.empty.title"
      :subTitle="gamesContent?.empty.description"
      :image="gamesContent?.empty.image"
    />

    <atomic-seo-text v-if="gamesContent?.seo?.text" v-bind="gamesContent?.seo?.text" />
  </div>
</template>

<script setup lang="ts">
  import {
    CollectionInterface,
    GameProviderInterface,
    GameInterface,
    GamesResponseInterface,
    PaginationMetaInterface,
  } from '@platform/frontend-core/dist/module';
  import { storeToRefs } from 'pinia';
  import { CategoryGamesInterface } from '~/types';

  const globalStore = useGlobalStore();
  const { currentLocale, gameCategoriesObj, headerContent } = storeToRefs(globalStore);
  const gamesContentRequest = await useAsyncData('gamesContent', () => queryContent(`page-controls/${currentLocale.value.code}`).only(['gamesPage']).findOne());
  const gamesContent:CategoryGamesInterface|undefined = gamesContentRequest.data.value?.gamesPage;
  const { setPageSeo } = useProjectMethods();
  setPageSeo(gamesContent?.seo);

  const { gameCollections } = useGamesStore();
  const { selectOptions } = useFieldsStore();
  const providerDropdownOptions:GameProviderInterface[] = [
    {
      id: 'all',
      name: gamesContent?.providersLabel || 'All Providers',
      identity: 'all',
      code: 'all',
      value: gamesContent?.providersLabel || 'All Providers',
    },
    ...selectOptions.providers,
  ];
  const route = useRoute();
  const router = useRouter();

  if (!route.query.category) {
    router.replace({
      query: { ...route.query, category: gameCollections[0].identity },
    });
  }

  const activeCollection = ref<CollectionInterface>(
    gameCollections.find(
      (collection) => collection.identity === route.query.category,
    ) || gameCollections[0],
  );

  const currentProvider = ref<GameProviderInterface>(
    providerDropdownOptions.find(
      (provider: GameProviderInterface) => provider.identity === route.query.provider,
    ) || providerDropdownOptions[0],
  );

  const sortOrder = ref<string>(route.query.sort as string || 'asc');
  const searchValue = ref<string>('');
  const loadPage = ref<number>(1);
  const gameItems = ref<GameInterface[]>([]);
  const pageMeta = ref<PaginationMetaInterface>();

  const { getFilteredGames } = useCoreGamesApi();

  const getItems = async (): Promise<GamesResponseInterface> => {
    const params: any = {
      page: loadPage.value,
      perPage: 36,
      collectionId: activeCollection.value.id,
      sortBy: 'name',
      sortOrder: sortOrder.value,
    };
    if (currentProvider.value?.id !== 'all') {
      params.providerId = currentProvider.value.id;
    }
    if (searchValue.value) params.name = searchValue.value;

    const response = await getFilteredGames(params);
    return response;
  };

  const setItems = (response: GamesResponseInterface, more?: boolean): void => {
    gameItems.value = more
      ? gameItems.value.concat(response.data)
      : response.data;
    pageMeta.value = response.meta;
  };

  const { data } = await useAsyncData('items', getItems, { initialCache: false });
  setItems(data.value);

  const changeProvider = async (providerId: string): Promise<void> => {
    loadPage.value = 1;

    currentProvider.value = providerDropdownOptions.find(
      (provider: GameProviderInterface) => provider.id === providerId,
    );

    router.replace({
      query: {
        ...route.query,
        provider:
          currentProvider.value.id !== 'all'
            ? currentProvider.value.identity
            : undefined,
      },
    });
    const response = await getItems();
    setItems(response);
  };

  const changeCategory = async (categoryId: string): Promise<void> => {
    loadPage.value = 1;
    activeCollection.value = gameCollections.find(
      (collection) => collection.identity === categoryId,
    );
    router.replace({ query: { ...route.query, category: categoryId } });
    const response = await getItems();
    setItems(response);
  };

  const changeSort = async (sortId: string): Promise<void> => {
    loadPage.value = 1;
    sortOrder.value = sortId;
    router.replace({ query: { ...route.query, sort: sortId } });
    const response = await getItems();
    setItems(response);
  };

  const { $_ } = useNuxtApp();
  const searchInput = $_.debounce(
    async (): Promise<void> => {
      if (searchValue.value.length > 1 || !searchValue.value) {
        loadPage.value = 1;
        const response = await getItems();
        setItems(response);
      }
    },
    500,
    { leading: false },
  );

  const loadMoreItems = async (): Promise<void> => {
    loadPage.value = pageMeta.value.page + 1;
    const response = await getItems();
    setItems(response, true);
  };

  watch(
    () => route.query.category,
    async (newValue: string) => {
      if (
        (route.name === 'games' || route.name === 'locale-games')
        && route.query.category !== activeCollection.value.identity
      ) {
        await changeCategory(newValue);
      }
    },
  );
</script>

<style lang="scss" src="./games.scss" />
