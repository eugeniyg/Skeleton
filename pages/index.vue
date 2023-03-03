<template>
  <div class="home">
    <div v-if="homeContent?.banner" class="promo-card-wrapper">
      <card-home v-bind="homeContent.banner"/>
    </div>

    <div class="cards-wrap">
      <div class="cards-cat" v-if="homeContent?.categories">
        <card-category
          v-for="(item, itemIndex) in Object.keys(homeContent.categories)"
          :key="itemIndex"
          :mod="item"
          v-bind="homeContent.categories[item]"
        />
      </div>

      <!--<group-benefits/>-->
    </div>

    <group-turbo/>

    <group-games
      v-if="hotCategory"
      showAllBtn
      showArrows
      :category="hotCategory"
    />

    <div id="sports-container" />

    <group-games
      v-if="newCategory"
      showAllBtn
      showArrows
      :category="newCategory"
    />

    <cards-group
      v-if="providerCards.games?.length"
      v-bind="providerCards"
      :identity="groupContent?.providers.label"
      :titleIcon="groupContent?.providers.icon"
      :showAllBtn="false"
    >
      <template v-slot:card="item">
        <card-providers v-bind="item" />
      </template>
    </cards-group>

    <group-promotions/>

    <atomic-seo-text v-if="homeContent?.seo?.text" v-bind="homeContent.seo.text"/>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { CardsGroupInterface, HomeContentInterface } from '~/types';

  const globalStore = useGlobalStore();
  const gameStore = useGamesStore();
  const fakeStore = useFakeStore();
  const providerCards = fakeStore.providerCards();
  const { gameCollections } = storeToRefs(gameStore);
  const { currentLocale, globalComponentsContent } = storeToRefs(globalStore);
  const groupContent: Maybe<CardsGroupInterface> = globalComponentsContent.value?.cardsGroup;

  const homeContentRequest = await useAsyncData(
    'homeContent',
    () => queryContent(`page-controls/${currentLocale.value?.code}`).only(['homePage']).findOne(),
  );
  const homeContent: Maybe<HomeContentInterface> = homeContentRequest.data.value?.homePage;
  const { setPageSeo, localizePath } = useProjectMethods();
  setPageSeo(homeContent?.seo);

  const hotCategory = gameCollections.value.find((collection) => collection.identity === 'hot');
  const newCategory = gameCollections.value.find((collection) => collection.identity === 'new');

  const { betsyParams } = useGamesStore();
  const startBetsyWidget = ():void => {
    const mainHost = window.location.origin;
    const params = {
      ...betsyParams,
      mainFrameUrl: mainHost + localizePath('/betting'),
      lang: currentLocale.value?.code || 'en',
      containerId: 'sports-container',
      height: '372px',
      theme: 'slotsbet',
    };

    if (window.BetSdk) window.BetSdk.initTopEventsWidget(params);
  };

  onMounted(() => {
    startBetsyWidget();
  });
</script>

<style lang="scss">
.home {
  #sports-container {
    margin-bottom: rem(32px);

    @include media(l) {
      margin-bottom: rem(40px);
    }
  }
}
</style>
