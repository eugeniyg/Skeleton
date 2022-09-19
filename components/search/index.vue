<template>
  <div class="search" :class="{'is-show': props.isShow}">
    <form-input-search
      ref="inputElement"
      v-model:value="searchValue"
      :placeholder="headerContent?.search?.placeholder"
      @input="searchInput"
    />

    <list-result-search
      :items="gameItems"
      :defaultItems="defaultGames"
      :isShowLoadMore="showLoadMore"
      :isShow="isShowSearchResult"
      @loadMore="loadMoreItems"
      @hideSearch="emit('hideSearch')"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import {
    GameInterface, GamesResponseInterface, PaginationMetaInterface,
  } from '@platform/frontend-core/dist/module';

  const props = defineProps({
    isShow: {
      type: Boolean,
      default: false,
    },
    query: {
      type: String,
    },
  });

  const emit = defineEmits(['hideSearch']);
  const { headerContent } = useGlobalStore();
  const searchValue = ref<string>('');
  const pendingGames = ref<boolean>(true);
  const loadPage = ref<number>(1);
  const pageMeta = ref<PaginationMetaInterface>();
  const gameItems = ref<GameInterface[]>([]);
  const isShowSearchResult = computed(() => searchValue.value.length > 1 && !pendingGames.value);
  const showLoadMore = computed(() => !!gameItems.value.length && (pageMeta.value.totalPages > pageMeta.value.page));

  const { getFilteredGames } = useCoreGamesApi();
  const getItems = async (): Promise<GamesResponseInterface> => {
    const params: any = { page: loadPage.value, perPage: 5, name: searchValue.value };

    const response = await getFilteredGames(params);
    return response;
  };

  const setItems = (response: GamesResponseInterface, more?: boolean): void => {
    gameItems.value = more
      ? gameItems.value.concat(response.data)
      : response.data;
    pageMeta.value = response.meta;
  };

  const loadMoreItems = async (): Promise<void> => {
    loadPage.value = pageMeta.value.page + 1;
    const response = await getItems();
    setItems(response, true);
  };

  const { $_ } = useNuxtApp();
  const searchInput = $_.debounce(
    async (): Promise<void> => {
      if (searchValue.value.length > 1) {
        loadPage.value = 1;
        const response = await getItems();
        setItems(response);
        pendingGames.value = false;
      } else pendingGames.value = true;
    },
    500,
    { leading: false },
  );

  const inputElement = ref();
  watch(() => props.isShow, (newValue:boolean) => {
    if (newValue) searchValue.value = '';
    setTimeout(() => {
      inputElement.value.$el.querySelector('input').focus();
    }, 50);
  });

  const defaultGames = ref<GameInterface[]>([]);
  const gameStore = useGamesStore();
  const { gameCollections } = storeToRefs(gameStore);
  const getTurbogamesId = gameCollections.value.find((collection) => collection.identity === 'turbogames')?.id;

  onMounted(async () => {
    if (getTurbogamesId) {
      const defaultGamesResponse = await getFilteredGames({
        page: 1,
        perPage: 4,
        collectionId: getTurbogamesId,
      });
      defaultGames.value = defaultGamesResponse.data;
    }
  });
</script>

<style lang="scss" src="./style.scss"/>
