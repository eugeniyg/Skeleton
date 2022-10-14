<template>
  <div v-if="showBlock" class="favorite-recently">
    <div class="header">
      <button-base
        v-for="({ icon, title, id }, itemIndex) in tabsData"
        :key="itemIndex"
        :class="{'is-active': selectedTabs.includes(id)}"
        @click="changeTab(id)"
      >
        <atomic-icon :id="icon" v-if="icon"/>{{ title }}
      </button-base>
    </div>

    <div class="content">
      <div v-if="favoriteGames.length && selectedTabs.includes('favorites')" class="tab">
        <group-favorites />
      </div>

      <div v-if="recentlyGames.length && selectedTabs.includes('recently-played')" class="tab">
        <group-recently :gamesList="recentlyGames" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { GameInterface } from '@platform/frontend-core/dist/module';
  import { CardsGroupInterface } from '~/types';

  const globalStore = useGlobalStore();
  const { globalComponentsContent, isMobile } = storeToRefs(globalStore);
  const groupContent:CardsGroupInterface|undefined = globalComponentsContent.value?.cardsGroup;

  const gameStore = useGamesStore();
  const { favoriteGames } = storeToRefs(gameStore);
  const recentlyGames = ref<GameInterface[]>([]);
  const selectedTabs = ref<string[]>([]);

  const favoritesItem = {
    title: groupContent?.favorites.label,
    icon: groupContent?.favorites.icon,
    id: 'favorites',
  };
  const recentlyItem = {
    title: groupContent?.recentlyPlayed.label,
    icon: groupContent?.recentlyPlayed.icon,
    id: 'recently-played',
  };

  const tabsData = computed(() => {
    const arr = [];
    if (favoriteGames.value?.length) arr.push(favoritesItem);
    if (recentlyGames.value?.length) arr.push(recentlyItem);
    const tabsId = arr.map((item) => item.id);
    if (window.innerWidth > 767) selectedTabs.value = tabsId;
    else if (!tabsId.includes(selectedTabs.value[0]) && arr.length) selectedTabs.value = [arr[0].id];
    return arr;
  });

  const changeTab = (id: string):void => {
    if (selectedTabs.value[0] === id) return;
    selectedTabs.value = [id];
  };

  const { getRecentlyPlayed } = useCoreGamesApi();
  const profileStore = useProfileStore();
  const { profile } = storeToRefs(profileStore);
  const loadingRecently = ref<boolean>(true);
  onMounted(async () => {
    const recentlyResponse = await getRecentlyPlayed({
      perPage: 18,
      platform: isMobile.value ? 1 : 2,
      countryCode: profile.value?.country,
    });
    recentlyGames.value = recentlyResponse;
    loadingRecently.value = false;
  });

  const showBlock = computed(() => !loadingRecently.value && (recentlyGames.value.length || favoriteGames.value.length));
</script>

<style lang="scss">
.favorite-recently {
  @include radius(16px);
  padding: rem(16px) rem(16px) rem(8px);
  background-color: var(--gray-900);

  .header {
    @extend %flex-items-center;
    padding: var(--padding, 0 0 8px 0);

    @include media(sm) {
      display: none;
    }

    .btn {
      @include font($body-1);
      --width: 100%;
      --color: var(--gray-400);

      &.is-active {
        --bg: var(--gray-800);
        --color: var(--white);
      }

      &:hover {
        cursor: pointer;
      }
    }
  }

  @include media(sm) {
    padding-bottom: rem(16px);

    .content {
      display: grid;
      grid-auto-flow: column;
      grid-column-gap: rem(24px);
      grid-auto-columns: minmax(0, 1fr);
    }

    .tab {
      display: block;
    }
  }
}
</style>
