<template>
  <div class="category">
    <nav-cat @clickCategory="changeCategory" />

    <atomic-cat-heading :icon="sortedCategories[activeCollection.identity]">
      {{ activeCollection.name }}
    </atomic-cat-heading>

    <form-input-search
      v-model:value="searchValue"
      placeholder="Search your game"
      @input="searchInput"
    />

    <div class="filters">
      <form-dropdown-base
        :value="currentProvider.id"
        name="providers"
        placeholder="Providers"
        :options="selectOptions.providers"
        @input="changeProvider"
      />
      <!--      <form-filters/>-->
    </div>

    <list-grid :items="gameItems" :meta="pageMeta" @loadMore="loadMoreItems" />

    <atomic-empty
      v-if="gameItems.length === 0"
      title="Nothing found"
      subTitle="Try searching for something else"
      variant="search-result"
    />
  </div>
</template>

<script setup lang="ts">
  import {
    useGamesApi,
    CollectionInterface,
    GameProviderInterface,
    GameInterface,
    GamesResponseInterface,
    PaginationMetaInterface,
  } from '~/CORE';

  const { gameCollections, sortedCategories } = useGamesStore();
  const { selectOptions } = useFieldsStore();
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
    selectOptions.providers.find(
      (provider: GameProviderInterface) => provider.identity === route.query.provider,
    ) || selectOptions.providers[0],
  );

  const searchValue = ref<string>('');
  const loadPage = ref<number>(1);
  const gameItems = ref<GameInterface[]>([]);
  const pageMeta = ref<PaginationMetaInterface>();

  const { getFilteredGames } = useGamesApi();

  const getItems = async (): Promise<GamesResponseInterface> => {
    const params: any = { page: loadPage.value, perPage: 36 };
    if (activeCollection.value?.id) {
      params.collectionId = activeCollection.value.id;
    }
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

    currentProvider.value = selectOptions.providers.find(
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
