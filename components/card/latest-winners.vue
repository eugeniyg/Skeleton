<template>
  <nuxt-link class="card-latest-winners" :to="gameUrl">
    <div class="img" :style="backgroundImage"></div>
    <div class="title">{{ props.nickname }}</div>
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
    if (!isLoggedIn.value && props.isDemoMode) return localizePath(`/games/${props.gameId}?demo=true`);
    return localizePath(`/games/${props.gameId}`);
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
  width: var(--min-width, #{rem(230px)});
  height: var(--height, auto);
  padding: rem(8px);
  background-color: var(--bg, var(--gray-800));
  display: grid;
  grid-template-areas:
    "img title"
    "img sub-title"
    "img items";
  grid-template-columns: rem(56px) 1fr;
  grid-column-gap: rem(8px);
  border-radius: rem(8px);
  flex-shrink: 0;
  align-self: stretch;
  align-items: flex-start;
  text-decoration: none;
  @extend %cards-items;
  scroll-snap-align: var(--scroll-snap-align, start);

  @include media(md) {
    --min-width: #{column(5)};
  }

  @include media(xxl) {
    --min-width: #{column(6)};
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
