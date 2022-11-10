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
  import debounce from 'lodash/debounce';

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
  const showLoadMore = computed(() => !!gameItems.value.length && ((pageMeta.value?.totalPages || 1) > (pageMeta.value?.page || 1)));

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
    loadPage.value = (pageMeta.value?.page || 0) + 1;
    const response = await getItems();
    setItems(response, true);
  };

  const searchInput = debounce(async (): Promise<void> => {
    if (searchValue.value.length > 1) {
      loadPage.value = 1;
      const response = await getItems();
      setItems(response);
      pendingGames.value = false;
    } else pendingGames.value = true;
  }, 500, { leading: false });

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

<style lang="scss">
.search {
  background-color: var(--bg, var(--gray-800));
  box-shadow: var(--box--shadow, 0 0 12px rgba(0, 0, 0, 0.16));
  padding: var(--padding-search, #{rem(4px)} #{rem(16px)});
  position: var(--position, absolute);
  width: var(--width, 100%);
  top: var(--top, #{rem(64px)});
  left: var(--left, 0);
  right: 0;
  margin-left: auto;
  visibility: hidden;
  opacity: 0;
  transition: visibility .2s, opacity .2s ease-in-out;

  .app-header & {
    &.is-show {
      visibility: visible;
      opacity: 1;

      ~ .btn-search {
        visibility: hidden;
      }
    }

    @include media(l) {
      --position: relative;
      --left: #{rem(48px)};
      --top: 0;
      --width: #{rem(320px)};
      --padding-search: 0;
      --bg: transparent;
    }
  }
}
</style>
