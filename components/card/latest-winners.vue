<template>
  <nuxt-link class="card-latest-winners" :to="gameUrl">
    <div class="img" :style="backgroundImage"></div>
    <div class="title">{{ props.nickname || 'Unknown' }}</div>
    <div class="sub-title">{{ props.gameName }}</div>
    <div class="items">
      <span class="item">{{ formatedSum.amount }} {{ formatedSum.currency }}</span>
    </div>
  </nuxt-link>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { IGameImages } from '@skeleton/core/types';

  const props = defineProps<{
    nickname: Maybe<string>,
    amount: number,
    currency: string,
    resultBalance: number,
    gameId: string,
    gameName: string,
    isDemoMode: boolean,
    gameImages: IGameImages
  }>();

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { localizePath, getImageUrl, formatBalance } = useProjectMethods();
  const globalStore = useGlobalStore();
  const { baseApiUrl } = storeToRefs(globalStore);

  const gameUrl = computed(() => {
    if (!isLoggedIn.value && props.isDemoMode) return localizePath(`/games/${props.gameId}`);
    return localizePath(`/games/${props.gameId}?real=true`);
  });

  const formatedSum = computed(() => formatBalance(props.currency, props.resultBalance));

  const backgroundImage = computed(() => {
    if (props.gameImages.hasOwnProperty('200x200')) {
      return `background-image:url(${getImageUrl(props.gameImages, 'square')})`;
    } return 'background-image: none';
  });
</script>

<style src="~/assets/styles/components/card/latest-winners.scss" lang="scss" />

