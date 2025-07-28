<template>
  <div class="group-favorites">
    <atomic-icon
      v-if="getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.favorites')"
      :id="getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.favorites.icon')"
    />

    <h2 class="title">
      {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.favorites.label') }}
    </h2>

    <button-base v-if="showAllBtn" class="btn-show-all" url="/favorites" type="ghost">
      {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.moreButton') }}
    </button-base>

    <div ref="container" class="items">
      <card-simple v-for="(favorite, favoriteIndex) in favoriteList" :key="favoriteIndex" v-bind="favorite" />
    </div>
  </div>
</template>

<script setup lang="ts">
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = useGlobalStore();
  const gameStore = useGamesStore();
  const { favoriteGames } = storeToRefs(gameStore);
  const container = ref();

  const showAllBtn = ref<boolean>(true);
  const cardInBlock = ref<number>(20);
  const favoriteList = computed(() => favoriteGames.value.slice(0, cardInBlock.value));

  const calcItems = (): void => {
    if (!favoriteGames.value.length) return;
    const cardSimple: any = document.querySelector('.group-favorites .card');
    const containerWidth = getComputedStyle(container.value).width.replace('px', '');
    const cardWidth = getComputedStyle(cardSimple).width.replace('px', '');
    cardInBlock.value = Math.floor(Number(containerWidth) / Number(cardWidth));
  };

  onMounted(() => {
    calcItems();
  });
</script>

<style src="~/assets/styles/components/group/favorites.scss" lang="scss" />
