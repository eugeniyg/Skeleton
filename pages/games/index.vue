<template>
  <div class="category">
    
    <!--<nav-cat @clickCategory="changeCategory"/>-->

    <atomic-cat-heading
      :icon="gameCategoriesObj[activeCollection?.identity || '']?.icon"
    >
      {{ gameCategoriesObj[activeCollection?.identity || '']?.label || activeCollection?.name }}
    </atomic-cat-heading>

    <div class="game-filter" v-click-outside="skipActionsState">
      <nav-category @clickCategory="changeCategory" hide-items/>
      
      <form-input-search
        class="game-filter__search"
        v-model:value="searchValue"
        :placeholder="getContent(layoutData, defaultLocaleLayoutData, 'header.search.placeholder')"
        @input="searchInput"
      />
      
      <button-toggle-filter
        :is-active="isShowFilter"
        @toggle="toggleFilter"
      />
      
      
      <form-input-providers
        :currentLocaleContent="gamesContent"
        :defaultLocaleContent="defaultLocaleGamesContent"
        :selected="selectedProviders"
        @select="changeProvider"
      />
      
      <!--
      <div class="game-filter__actions">
        <button-toggle-search :is-active="isShowSearch" @toggle="toggleSearch"/>
      </div>
      -->
      
      <atomic-game-sort
        class="game-filter__sort"
        v-show="isShowFilter"
        v-if="getContent(gamesContent, defaultLocaleGamesContent, 'sortOptions')?.length"
        :sortOrderValue="sortOrder"
        :sortByValue="sortBy"
        @change="changeSort"
        v-bind="gamesContent?.sortOptions?.length ? gamesContent : defaultLocaleGamesContent"
      />
      
      
      <providers-tags  :selected="selectedProviders"/>
      
      <client-only>
        <modal-providers
          :selected="selectedProviders"
          @select="changeProvider"
        />
        <modal-categories/>
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
      :title="getContent(gamesContent, defaultLocaleGamesContent, 'empty.title')"
      :subTitle="getContent(gamesContent, defaultLocaleGamesContent, 'empty.description')"
      :image="getContent(gamesContent, defaultLocaleGamesContent, 'empty.image')"
    />

    <atomic-seo-text v-if="gamesContent?.pageMeta?.seoText" v-bind="gamesContent?.pageMeta?.seoText"/>
  </div>
</template>

<script setup lang="ts">
  import type {
    ICollection,
    IGame,
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
    currentLocale,
    defaultLocale,
    defaultLocaleLayoutData,
    headerCountry,
    isMobile
  } = storeToRefs(globalStore);

  const {
    setPageMeta,
    getContent,
    getLocalesContentData,
  } = useProjectMethods();

  const route = useRoute();
  const router = useRouter();

  const sortBy = ref<string | undefined>(route.query.sortBy as string || 'default');
  const sortOrder = ref<string | undefined>(route.query.sortOrder as string || 'asc');

  interface IPageContent {
    currentLocaleData: Maybe<IGamesPage>;
    defaultLocaleData: Maybe<IGamesPage>;
  }

  const gamesContent = ref<Maybe<IGamesPage>>();
  const defaultLocaleGamesContent = ref<Maybe<IGamesPage>>();

  const setContentData = (contentData: Maybe<IPageContent>): void => {
    gamesContent.value = contentData?.currentLocaleData;
    defaultLocaleGamesContent.value = contentData?.defaultLocaleData;
    setPageMeta(gamesContent.value?.pageMeta);
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const nuxtContentData = useNuxtData('gamesPageContent');
    if (nuxtContentData.data.value) return nuxtContentData.data.value;

    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'pages', 'games').findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'pages', 'games').findOne()
    ]);
    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  }

  const { pending, data } = await useLazyAsyncData('gamesPageContent', () => getPageContent());
  if (data.value) setContentData(data.value);

  watch(data, () => {
    setContentData(data.value);
  })

  const selectedProviders = ref<string[]>([]);
  const activeCollection = ref<ICollection | undefined>();
  const routeProvider = route.query.provider as string|string[];

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

    router.replace({
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
    if (route.query.category !== categoryId) await router.replace({ query: { ...route.query, category: categoryId } });
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

  const { getProviderList, getCollectionsList } = useGamesStore();
  const setSelectedProviders = async (): Promise<void> => {
    const gameProviders = await getProviderList();
    const providersArr = Array.isArray(routeProvider) ? routeProvider : [routeProvider];
    selectedProviders.value = providersArr.filter(providerId => {
      const providerData = gameProviders.find(provider => provider.id === providerId);
      return providerData && !!providerData.gameEnabledCount;
    })
  }

  onMounted(async () => {
    if (routeProvider) await setSelectedProviders();
    const gameCollections = await getCollectionsList();

    activeCollection.value = gameCollections.find(
      (collection) => collection.identity === route.query.category,
    );

    if (!route.query.category || !activeCollection.value) {
      return router.replace({ query: { ...route.query, category: gameCollections[0].identity } });
    }

    const itemsResponse = await getItems();
    setItems(itemsResponse);
  });

  const toggleFilter = () => {
    isShowFilter.value = !isShowFilter.value;
  };
  
  const skipActionsState = () => {
    isShowFilter.value = false;
  }
</script>

<style src="~/assets/styles/pages/games/index.scss" lang="scss"/>
