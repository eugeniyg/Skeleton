<template>
  <div class="search" :class="{ 'is-show': props.isShow }">
    <form-input-search
      ref="inputElement"
      v-model:value="searchValue"
      :placeholder="getContent(layoutData, defaultLocaleLayoutData, 'header.search.placeholder')"
      @input="searchInput"
    />

    <list-result-search
      :items="gameItems"
      :default-items="defaultGames"
      :is-show-load-more="showLoadMore"
      :is-show="isShowSearchResult"
      @load-more="loadMoreItems"
      @hide-search="emit('hideSearch')"
    />
  </div>
</template>

<script setup lang="ts">
  import type { IGame, IGamesResponse, IPaginationMeta } from '@skeleton/api/types';
  import debounce from 'lodash/debounce';
  import { getFilteredGames } from '@skeleton/api/games';

  const props = defineProps<{
    isShow?: boolean;
  }>();

  const emit = defineEmits(['hideSearch']);
  const globalStore = useGlobalStore();
  const { layoutData, defaultLocaleLayoutData } = globalStore;
  const { headerCountry } = storeToRefs(globalStore);
  const searchValue = ref<string>('');
  const pendingGames = ref<boolean>(true);
  const loadPage = ref<number>(1);
  const pageMeta = ref<IPaginationMeta>();
  const gameItems = ref<IGame[]>([]);
  const isShowSearchResult = computed(() => searchValue.value.length > 1 && !pendingGames.value);
  const showLoadMore = computed(
    () => !!gameItems.value.length && (pageMeta.value?.totalPages || 1) > (pageMeta.value?.page || 1)
  );

  const getItems = async (): Promise<IGamesResponse> => {
    const params: any = {
      page: loadPage.value,
      perPage: 5,
      name: searchValue.value,
      countries: headerCountry.value ? [headerCountry.value] : undefined,
      sortBy: 'name',
      sortOrder: 'asc',
    };

    return await getFilteredGames(params);
  };

  const setItems = (response: IGamesResponse, more?: boolean): void => {
    gameItems.value = more ? gameItems.value.concat(response.data) : response.data;
    pageMeta.value = response.meta;
  };

  const loadMoreItems = async (): Promise<void> => {
    loadPage.value = (pageMeta.value?.page || 0) + 1;
    const response = await getItems();
    setItems(response, true);
  };

  const searchInput = debounce(
    async (): Promise<void> => {
      if (searchValue.value.length > 1) {
        loadPage.value = 1;
        const response = await getItems();
        setItems(response);
        pendingGames.value = false;
      } else pendingGames.value = true;
    },
    500,
    { leading: false }
  );

  const inputElement = ref();
  watch(
    () => props.isShow,
    (newValue: boolean) => {
      if (newValue) searchValue.value = '';
      setTimeout(() => {
        inputElement.value.$el.querySelector('input').focus();
      }, 50);
    }
  );

  const defaultGames = ref<IGame[]>([]);
  const getDefaultGames = async (): Promise<IGamesResponse> => {
    const { collectionsByCountry } = useGamesStore();
    const getTurbogamesId = collectionsByCountry.find(collection => collection.identity === 'turbogames')?.id;
    const requestParams = {
      page: 1,
      perPage: 4,
      collectionId: getTurbogamesId ? [getTurbogamesId] : [collectionsByCountry[0]?.id],
      countries: headerCountry.value ? [headerCountry.value] : undefined,
      sortBy: 'default',
      sortOrder: 'asc',
    };

    try {
      return await getFilteredGames(requestParams);
    } catch {
      console.error('Search default games loading failed!');
      return { data: [], meta: { page: 1, perPage: 4, totalPages: 0, totalRows: 0 } };
    }
  };

  onMounted(async () => {
    const { data } = await getDefaultGames();
    defaultGames.value = data;
  });
</script>

<style src="~/assets/styles/components/search.scss" lang="scss" />
