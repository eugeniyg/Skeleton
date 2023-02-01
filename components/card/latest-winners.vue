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
  import { GameImagesInterface } from '@platform/frontend-core/dist/module';

  const props = defineProps<{
    nickname: string|null,
    amount: number,
    currency: string,
    resultBalance: number,
    gameId: string,
    gameName: string,
    isDemoMode: boolean,
    gameImages: GameImagesInterface
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
      return `background-image:url(${baseApiUrl.value}/img/gcdn${getImageUrl(props.gameImages, 'square')})`;
    } return 'background-image: none';
  });
</script>

<style lang="scss">
.card-latest-winners {
  --col-count: 1.4;
  --col-gap: 8px;

  height: var(--height, auto);
  width: calc(calc(100% / var(--col-count)) - calc(var(--col-gap) - calc(var(--col-gap)/var(--col-count))));
  padding: rem(15px) rem(8px) ;
  background-color: var(--bg, var(--gray-800));
  display: grid;
  align-content: center;
  grid-template-areas:
    "img title"
    "img sub-title"
    "img items";
  grid-template-columns: rem(56px) 1fr;
  flex-shrink: 0;
  align-self: stretch;
  align-items: flex-start;
  text-decoration: none;
  border-radius: 8px;
  grid-column-gap: rem(8px);
  scroll-snap-align: var(--scroll-snap-align, start);
  min-width: var(--card-min-width, 224px);

  @include media(xs) {
    --col-count: 2.4;
  }

  @include media(xs) {
    --col-count: 2.89;
  }

  @include media(md) {
    --col-gap: 16px;
    --col-count: 4;
    --card-min-width: auto;
  }

  @include media(xxl) {
    --col-count: 6;
  }

  .img {
    grid-area: img;
    width: rem(56px);
    height: rem(56px);
    background-repeat: var(--bg-repeat, no-repeat);
    background-size: var(--bg-size, cover);
    background-position: var(--bg-position, top center);
    border-radius: 8px;
    overflow: hidden;
    align-self: center;
  }

  .title {
    grid-area: title;
    @include font($body-1);
    color: var(--gray-300);
    min-height: 16px;
  }

  .sub-title {
    grid-area: sub-title;
    @include font($heading-1);
    color: var(--white);
  }

  .items {
    grid-area: items;
    @include font($heading-2);
    @extend %flex-items-center;
    grid-column-gap: 8px;
    color: var(--yellow-500);
    margin-top: rem(4px);
  }
}
</style>
