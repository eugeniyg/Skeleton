<template>
  <div class="home">
    <div v-if="homeContent?.banner" class="promo-card-wrapper">
      <!--<card-promo v-bind="homeContent.banner" />-->
      <card-home v-bind="homeContent.banner"/>
    </div>

    <div v-if="homeContent?.categories" class="categories">
      <card-category
        v-for="(item, itemIndex) in Object.keys(homeContent.categories)"
        :key="itemIndex"
        v-bind="homeContent.categories[item]"
      />
    </div>

    <div class="cards-cat">
      <div class="card-cat card-cat-casino">
        <div class="title">Casino</div>
        <div class="sub-title">Enjoy more than 3000+ provably fair slots & games</div>
        <img class="icon" :src="casinoIcon" alt="">
        <button-base type="secondary" size="md">Go to Casino</button-base>
      </div>

      <div class="card-cat card-cat-betting">
        <div class="title">Betting</div>
        <div class="sub-title">The most competitive odds and markets. Bet and win right now</div>
        <img class="icon" :src="bettingIcon" alt="">
        <button-base type="secondary" size="md">Go to Betting</button-base>
      </div>

    </div>

    <group-benefits/>

    <group-turbo/>

    <group-promotions/>

    <atomic-seo-text v-if="homeContent?.seo?.text" v-bind="homeContent.seo.text"/>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { HomeContentInterface } from '~/types';
  import casinoIcon from '~/assets/img/home-banner/items/casino.png';
  import bettingIcon from '~/assets/img/home-banner/items/betting.png';

  const globalStore = useGlobalStore();
  const { currentLocale } = storeToRefs(globalStore);

  const homeContentRequest = await useAsyncData(
    'homeContent',
    () => queryContent(`page-controls/${currentLocale.value?.code}`).only(['homePage']).findOne(),
  );
  const homeContent: HomeContentInterface | undefined = homeContentRequest.data.value?.homePage;
  const { setPageSeo } = useProjectMethods();
  setPageSeo(homeContent?.seo);
</script>

<style lang="scss">
.card-cat {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 16px 24px;
  isolation: isolate;
  width: 328px;
  min-height: 167px;
  background: var(--orange-700);
  border-radius: 8px;
  align-content: flex-start;

  .title {
    @include font($heading-5);
    color: var(--white);
    position: relative;
    z-index: 1;
    margin-bottom: rem(4px);
    width: rem(200px);
  }

  .sub-title {
    @include font($body-2);
    color: var(--white);
    position: relative;
    z-index: 1;
    margin-bottom: rem(24px);
    width: rem(200px);
  }

  .btn-secondary {
    z-index: 1;
  }

  .icon {
    grid-area: icon;
    width: 160px;
    height: 135.38px;
    z-index: 1;
    position: absolute;
    top: 0;
    bottom: 0;
    right: -16px;
    margin: auto 0;
  }
}

.card-cat-casino {
  &:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(94.47deg, rgba(96, 12, 135, 0) 1.41%, rgba(95, 12, 135, 0.44) 97.61%);
    border-radius: 8px;
    transform: rotate(-180deg);
  }
}

.card-cart-betting {
}
</style>
