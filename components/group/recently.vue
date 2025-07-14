<template>
  <div class="group-recently">
    <atomic-icon
      v-if="getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.recentlyPlayed')"
      :id="getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.recentlyPlayed.icon')"
    />

    <h2 class="title">
      {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.recentlyPlayed.label') }}
    </h2>

    <button-base v-if="showAllBtn" class="btn-show-all" url="/recently-played" type="ghost">
      {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.moreButton') }}
    </button-base>

    <div ref="container" class="items">
      <card-simple v-for="(game, gameIndex) in currentGames" :key="gameIndex" v-bind="game" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IGame } from '@skeleton/core/types';

  const props = defineProps<{
    gamesList: IGame[];
  }>();

  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();

  const showAllBtn = ref<boolean>(true);
  const cardInBlock = ref<number>(20);
  const currentGames = computed(() => props.gamesList.slice(0, cardInBlock.value));
  const container = ref();

  const calcItems = (): void => {
    if (!props.gamesList.length) return;
    const cardSimple: any = document.querySelector('.group-recently .card');
    const containerWidth = getComputedStyle(container.value).width.replace('px', '');
    const cardWidth = getComputedStyle(cardSimple).width.replace('px', '');
    cardInBlock.value = Math.floor(Number(containerWidth) / Number(cardWidth));
  };

  onMounted(async () => {
    calcItems();
  });

  const gameStore = useGamesStore();
  const { favoriteGames } = storeToRefs(gameStore);
  watch(
    () => favoriteGames.value,
    async (newValue: IGame[], oldValue: IGame[]) => {
      if ((newValue.length === 0 || oldValue.length === 0) && props.gamesList.length) {
        await nextTick();
        calcItems();
      }
    }
  );
</script>

<style src="~/assets/styles/components/group/recently.scss" lang="scss" />
