<template>
  <nuxt-link class="card-latest-winners" :to="gameUrl">
    <atomic-image class="card-latest-winners__img" :src="src" />
    <Skeletor class="card-latest-winners__poster" as="div" />

    <div class="card-latest-winners__info">
      <div class="card-latest-winners__info-title">{{ props.nickname || 'Unknown' }}</div>
      <div class="card-latest-winners__info-items">
        <atomic-image
          class="card-latest-winners__info-img"
          width="12"
          height="12"
          :src="`/img/currency/${props.currency}.svg`"
          default-image="/img/currency/placeholder.svg"
        />
        <span class="card-latest-winners__info-amount">{{ formatedSum.amount }}</span>
        <span class="card-latest-winners__info-currency">{{ formatedSum.currency }}</span>
      </div>
    </div>
  </nuxt-link>
</template>

<script setup lang="ts">
  import type { IGameImages } from '@skeleton/api/types';
  import { Skeletor } from 'vue-skeletor';
  import { formatBalance } from '@skeleton/helpers/amountMethods';
  import { getGameImageUrl } from '@skeleton/helpers/urlBuildMethods';

  const props = defineProps<{
    nickname: Maybe<string>;
    amount: number;
    currency: string;
    payout: number;
    gameId: string;
    gameName: string;
    isDemoMode: boolean;
    gameImages: IGameImages;
    gameCustomImages?: IGameImages;
  }>();

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);

  const gameUrl = computed(() => {
    if (!isLoggedIn.value && props.isDemoMode) return localizePath(`/games/${props.gameId}`);
    return localizePath(`/games/${props.gameId}?real=true`);
  });

  const formatedSum = computed(() => formatBalance(props.currency, props.payout));

  const src = computed(() => getGameImageUrl(props.gameCustomImages, props.gameImages, 'vertical'));
</script>

<style src="~/assets/styles/components/card/latest-winners.scss" lang="scss" />
