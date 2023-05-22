<template>
  <div class="category">
    <nav-cat @clickCategory="changeCategory"/>

    <atomic-cat-heading
      v-if="gameCategoriesObj[activeCollection?.identity]"
      :icon="gameCategoriesObj[activeCollection?.identity].icon"
    >
      {{ gameCategoriesObj[activeCollection?.identity].label || activeCollection?.name }}
    </atomic-cat-heading>

    <div class="game-filter">
      <div class="game-filter__search">
        <form-input-search
          v-model:value="searchValue"
          :placeholder="getContent(headerContent, defaultLocaleHeaderContent, 'search.placeholder')"
          @input="searchInput"
        />

        <form-input-dropdown
          :value="currentProvider.id"
          name="providers"
          placeholder="Providers"
          :options="providerDropdownOptions"
          @input="changeProvider"
        />
      </div>
      <atomic-game-sort
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
    CollectionInterface,
    GameProviderInterface,
    GameInterface,
    GamesResponseInterface,
    PaginationMetaInterface,
  } from '@platform/frontend-core/dist/module';
  import { storeToRefs } from 'pinia';
  import debounce from 'lodash/debounce';
  import { CategoryGamesInterface } from '@skeleton/types';

  definePageMeta({
    middleware: 'games-collection',
  });

  const globalStore = useGlobalStore();
  const {
    gameCategoriesObj,
    headerContent,
    defaultLocaleHeaderContent,
    contentLocalesArray,
  } = storeToRefs(globalStore);

  const {
    setPageSeo,
    getContent,
    findLocalesContentData,
  } = useProjectMethods();
  const gamesContentRequest = await useAsyncData('gamesContent', () => queryContent('page-controls')
    .where({ locale: { $in: contentLocalesArray.value } }).only(['locale', 'gamesPage']).find());

  const { currentLocaleData, defaultLocaleData } = findLocalesContentData(gamesContentRequest.data.value);
  const gamesContent: Maybe<CategoryGamesInterface> = currentLocaleData?.gamesPage;
  const defaultLocaleGamesContent: Maybe<CategoryGamesInterface> = defaultLocaleData?.gamesPage;
  setPageSeo(gamesContent?.seo);

  const gamesStore = useGamesStore();
  const { currentLocaleCollections } = storeToRefs(gamesStore);
  const { selectOptions } = useFieldsStore();
  const providerDropdownOptions: GameProviderInterface[] = [
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

  const activeCollection = ref<CollectionInterface | undefined>(
    currentLocaleCollections.value.find((collection) => collection.identity === route.query.category),
  );

  const currentProvider = ref<GameProviderInterface | undefined>(
    providerDropdownOptions.find(
      (provider: GameProviderInterface) => provider.identity === route.query.provider,
    ) || providerDropdownOptions[0],
  );

  const sortBy = ref<string | undefined>(route.query.sortBy as string
    || getContent(gamesContent, defaultLocaleGamesContent, 'sortOptions.0.sortBy') || 'default');
  const sortOrder = ref<string | undefined>(route.query.sortOrder as string
    || getContent(gamesContent, defaultLocaleGamesContent, 'sortOptions.0.sortOrder') || 'asc');
  const searchValue = ref<string>('');
  const loadPage = ref<number>(1);
  const gameItems = ref<GameInterface[]>([]);
  const pageMeta = ref<PaginationMetaInterface>();
  const loadingGames = ref<boolean>(true);

  const { getFilteredGames } = useCoreGamesApi();

  const getItems = async (): Promise<GamesResponseInterface> => {
    const params: any = {
      page: loadPage.value,
      perPage: 36,
      collectionId: activeCollection.value?.id,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
    };

    if (currentProvider.value?.id !== 'all') {
      params.providerId = currentProvider.value?.id;
    }

    if (searchValue.value) params.name = searchValue.value;

    loadingGames.value = true;
    const response = await getFilteredGames(params);
    return response;
  };

  const setItems = (response: GamesResponseInterface, more?: boolean): void => {
    gameItems.value = more
      ? gameItems.value.concat(response.data)
      : response.data;
    pageMeta.value = response.meta;
    loadingGames.value = false;
  };

  const changeProvider = async (providerId: string): Promise<void> => {
    loadPage.value = 1;

    currentProvider.value = providerDropdownOptions.find(
      (provider: GameProviderInterface) => provider.id === providerId,
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
    activeCollection.value = currentLocaleCollections.value.find(
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
</script>

<style lang="scss">
.category {
  display: grid;
  grid-gap: rem(16px);

  .nav-cat-wrap {
    --margin-top: 0;
    --margin-bottom: 0;
  }
}

.game-filter {
  display: flex;
  justify-content: space-between;
  grid-column-gap: 40px;
  grid-row-gap: 16px;
  flex-wrap: wrap;

  .icon {
    --icon-size: 20px;
  }

  &__search {
    display: flex;
    flex-grow: 1;

    .input-search {
      flex-grow: 1;

      .field {
        border-radius: 12px 0 0 12px;
      }
    }
  }

  .dropdown {
    --select-width: auto;

    .selected {
      border-radius: 0 16px 16px 0;
      height: 100%;
      min-height: auto;
      border-left-color: var(--gray-700);
      padding: 8px 8px 8px 16px;

      //span {
      //  max-width: none;
      //  overflow: unset;
      //}

      .icon {
        position: relative;
        right: 0;
      }
    }

    .items {
      border-radius: 8px;
      right: 0;
      width: auto;
      left: auto;
    }

    .item {
      span {
        max-width: none;
        overflow: unset;
      }

      .icon {
        --icon-transform: rotate(0) translatex(0);
      }
    }

    &.is-open {
      .selected {
        border-left-color: var(--white);
      }
    }
  }
}
</style>
