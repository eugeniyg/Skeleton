<template>
  <div class="category">
    <atomic-cat-heading
      :icon="gameCategoriesObj[activeCollection?.identity || '']?.icon"
    >
      {{ gameCategoriesObj[activeCollection?.identity || '']?.label || activeCollection?.name }}
    </atomic-cat-heading>
    
    <div v-click-outside="skipActionsState" class="game-filter">
      <nav-category hide-items @clickCategory="changeCategory"/>
      
      <form-input-search
        v-model:value="searchValue"
        class="game-filter__search"
        :placeholder="getContent(layoutData, defaultLocaleLayoutData, 'header.search.placeholder')"
        @input="searchInput"
      />
      
      <button-toggle-filter
        :is-active="isShowFilter"
        @toggle="toggleFilter"
      />
      
      <atomic-game-sort
        v-show="isShowFilter"
        v-if="getContent(currentLocaleContent, defaultLocaleContent, 'sortOptions')?.length"
        class="game-filter__sort"
        :sortOrderValue="sortOrder"
        :sortByValue="sortBy"
        v-bind="currentLocaleContent?.sortOptions?.length ? currentLocaleContent : defaultLocaleContent"
        @change="changeSort"
      />
      
      <providers-tags
        v-if="tags.length"
        :selected="selectedProviders"
        :tags="tags"
        @unselect="changeProvider"
      />
      
      <client-only>
        <modal-providers
          :selected="selectedProviders"
          @select="selectProviders"
        />
        <modal-categories
          @click-category="changeCategory"
        />
      </client-only>
    
    </div>
    
    <list-grid
      v-if="gameItems.length"
      :items="gameItems"
      :meta="pageMeta"
      @loadMore="loadMoreItems"
    />
    
    <atomic-empty
      v-if="!gameItems.length && !loadingGames"
      :title="getContent(currentLocaleContent, defaultLocaleContent, 'empty.title')"
      :subTitle="getContent(currentLocaleContent, defaultLocaleContent, 'empty.description')"
      :image="getContent(currentLocaleContent, defaultLocaleContent, 'empty.image')"
    />
    
    <atomic-seo-text v-if="currentLocaleContent?.pageMeta?.seoText" v-bind="currentLocaleContent?.pageMeta?.seoText" />
  </div>
</template>

<script setup lang="ts">
  import type {
    ICollection,
    IGame, IGameProvider,
    IGamesResponse,
    IPaginationMeta
  } from '@skeleton/core/types';
  import { storeToRefs } from 'pinia';
  import debounce from 'lodash/debounce';
  import type { IGamesPage } from '~/types';
  
  const globalStore = useGlobalStore();
  const {
    gameCategoriesObj,
    layoutData,
    defaultLocaleLayoutData,
    headerCountry,
    isMobile
  } = storeToRefs(globalStore);
  
  const { getContent } = useProjectMethods();
  const layoutStore = useLayoutStore();
  const { closeModal } = layoutStore;
  const { modals } = storeToRefs(layoutStore);
  
  const route = useRoute();
  const router = useRouter();
  
  const sortBy = ref<string | undefined>(route.query.sortBy as string || 'default');
  const sortOrder = ref<string | undefined>(route.query.sortOrder as string || 'asc');
  
  const { currentLocaleContent, defaultLocaleContent } = await useContentLogic<IGamesPage>({
    contentKey: 'gamesPageContent',
    contentRoute: ['pages', 'games'],
    isPage: true
  });
  
  const selectedProviders = ref<string[]>([]);
  const activeCollection = ref<ICollection | undefined>();
  const routeProvider = route.query.provider as string | string[];
  
  const searchValue = ref<string>('');
  const loadPage = ref<number>(1);
  const gameItems = ref<IGame[]>([]);
  const pageMeta = ref<IPaginationMeta>();
  const loadingGames = ref<boolean>(true);
  const isShowFilter = ref<boolean>(false);
  
  const { getFilteredGames } = useCoreGamesApi();
  
  const getItems = async (): Promise<IGamesResponse> => {
    const params: any = {
      page: loadPage.value,
      perPage: (isMobile.value && window.innerHeight < 1000) ? 24 : 72,
      collectionId: activeCollection.value?.id,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
      countries: headerCountry.value ? [headerCountry.value] : undefined
    };
    
    if (searchValue.value) params.name = searchValue.value;
    if (selectedProviders.value.length) params.providerId = selectedProviders.value;
    
    const response = await getFilteredGames(params);
    loadingGames.value = false;
    
    return response;
  };
  
  const setItems = (response: IGamesResponse, more?: boolean): void => {
    gameItems.value = more
      ? gameItems.value.concat(response.data)
      : response.data;
    pageMeta.value = response.meta;
  };
  
  const changeProvider = async (newSelectedProviders: string[]): Promise<void> => {
    selectedProviders.value = newSelectedProviders;
    
    loadPage.value = 1;
    
    await router.replace({
      query: {
        ...route.query,
        provider: selectedProviders.value
      },
    });
    
    const response = await getItems();
    setItems(response);
  };
  
  const changeCategory = async (categoryId: string): Promise<void> => {
    loadPage.value = 1;
    const gameCollections = await getCollectionsList();
    activeCollection.value = gameCollections.find(collection => collection.identity === categoryId);
    if (!activeCollection.value) {
      throw createError({ fatal: true, statusCode: 404, statusMessage: 'Page Not Found' });
    }
    if (route.query.category !== categoryId) {
      await router.replace({
        query: {
          ...route.query,
          category: categoryId
        }
      });
    }
    window.scroll(0, 0);
    const response = await getItems();
    setItems(response);
    
    if (modals.value.categories) {
      closeModal('categories');
    }
    
  };
  
  const changeSort = async (...args: any): Promise<void> => {
    const [by, order] = args;
    loadPage.value = 1;
    sortBy.value = by;
    sortOrder.value = order;
    await router.replace({
      query: {
        ...route.query,
        sortBy: by,
        sortOrder: order
      }
    });
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
  
  const tags = ref<IGameProvider[]>([]);
  
  const {
    getProviderList,
    getCollectionsList
  } = useGamesStore();
  
  const setSelectedProviders = async (): Promise<void> => {
    const gameProviders = await getProviderList();
    const providersArr = Array.isArray(routeProvider) ? routeProvider : [routeProvider];
    
    selectedProviders.value = providersArr.filter(providerId => {
      const providerData = gameProviders.find(provider => provider.id === providerId);
      return providerData && !!providerData.gameEnabledCount;
    });
    
    await createTags();
  };
  
  const {
    popupsData,
    defaultLocalePopupsData
  } = useGlobalStore();
  
  const selectProviders = async (providersId: string[]) => {
    closeModal('providers');
    selectedProviders.value = providersId;
    const category = getContent(popupsData, defaultLocalePopupsData, 'providers.collectionId');
    await router.replace({ query: { ...route.query, category, provider: providersId }});
    await createTags();
    await changeProvider(selectedProviders.value)
  };
  
  const createTags = async () => {
    const gameProviders = await getProviderList();
    const providersList = gameProviders.filter(provider => !!provider.gameEnabledCount);
    tags.value = [];
    selectedProviders.value?.forEach(id => {
      const tag = providersList.find(provider => provider.id === id);
      if (tag) tags.value.push(tag);
    });
  };
  
  onMounted(async () => {
    if (routeProvider) await setSelectedProviders();
    const gameCollections = await getCollectionsList();

    if (!route.query.category && gameCollections.length) {
      return router.replace({
        query: {
          ...route.query,
          category: gameCollections[0].identity,
        }
      });
    }
    
    activeCollection.value = gameCollections.find(
      (collection) => collection.identity === route.query.category,
    );

    if (!activeCollection.value) {
      throw createError({ fatal: true, statusCode: 404, statusMessage: 'Page Not Found' });
    }
    
    const itemsResponse = await getItems();
    setItems(itemsResponse);
  });
  
  const toggleFilter = () => {
    isShowFilter.value = !isShowFilter.value;
  };
  
  const skipActionsState = () => {
    isShowFilter.value = false;
  };
  
  watch(() => route.query?.provider, async () => {
    await createTags();
  });
</script>

<style src="~/assets/styles/pages/games/index.scss" lang="scss"/>
