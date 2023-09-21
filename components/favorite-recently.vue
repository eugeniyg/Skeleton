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
import {storeToRefs} from 'pinia';
import {IGame} from '@skeleton/core/types';

const globalStore = useGlobalStore();
  const {
    globalComponentsContent,
    defaultLocaleGlobalComponentsContent,
    isMobile,
    headerCountry,
  } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();

  const gameStore = useGamesStore();
  const { favoriteGames } = storeToRefs(gameStore);
  const recentlyGames = ref<IGame[]>([]);
  const selectedTabs = ref<string[]>([]);

  const favoritesItem = {
    title: getContent(globalComponentsContent.value, defaultLocaleGlobalComponentsContent.value, 'cardsGroup.favorites.label'),
    icon: getContent(globalComponentsContent.value, defaultLocaleGlobalComponentsContent.value, 'cardsGroup.favorites.icon'),
    id: 'favorites',
  };
  const recentlyItem = {
    title: getContent(globalComponentsContent.value, defaultLocaleGlobalComponentsContent.value, 'cardsGroup.recentlyPlayed.label'),
    icon: getContent(globalComponentsContent.value, defaultLocaleGlobalComponentsContent.value, 'cardsGroup.recentlyPlayed.icon'),
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
    recentlyGames.value = await getRecentlyPlayed({
      perPage: 18,
      platform: isMobile.value ? 1 : 2,
      countryCode: profile.value?.country || headerCountry.value || 'UA',
    });
    loadingRecently.value = false;
  });

  const showBlock = computed(() => !loadingRecently.value && (recentlyGames.value.length || favoriteGames.value.length));
</script>

<style src="~/assets/styles/components/favorite-recently.scss" lang="scss" />

