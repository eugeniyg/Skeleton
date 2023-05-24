<template>
  <div class="home">
    <div v-if="homeContent?.banner || defaultLocaleHomeContent?.banner" class="promo-card-wrapper">
      <card-home v-bind="homeContent?.banner || defaultLocaleHomeContent?.banner"/>
    </div>

    <div class="cards-wrap">
      <div class="cards-cat" v-if="homeContent?.categories || defaultLocaleHomeContent?.categories">
        <card-category
          v-for="(item, itemIndex) in Object.keys(homeContent?.categories || defaultLocaleHomeContent?.categories)"
          :key="itemIndex"
          :mod="item"
          v-bind="homeContent?.categories[item] || defaultLocaleHomeContent?.categories[item]"
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
      :identity="getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.providers.label')"
      :titleIcon="getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'cardsGroup.providers.icon')"
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
  import { HomeContentInterface } from '~/types';

  const globalStore = useGlobalStore();
  const gameStore = useGamesStore();
  const fakeStore = useFakeStore();
  const providerCards = fakeStore.providerCards();
  const { currentLocaleCollections } = storeToRefs(gameStore);
  const {
    currentLocale,
    globalComponentsContent,
    defaultLocaleGlobalComponentsContent,
    contentLocalesArray,
  } = storeToRefs(globalStore);

  const {
    setPageSeo,
    localizePath,
    getContent,
    findLocalesContentData,
  } = useProjectMethods();

  const homeContentRequest = await useAsyncData('homeContent', () => queryContent('page-controls')
    .where({ locale: { $in: contentLocalesArray.value } }).only(['locale', 'homePage']).find());
  const { currentLocaleData, defaultLocaleData } = findLocalesContentData(homeContentRequest.data.value);
  const homeContent: Maybe<HomeContentInterface> = currentLocaleData?.homePage;
  const defaultLocaleHomeContent: Maybe<HomeContentInterface> = defaultLocaleData?.homePage;
  setPageSeo(homeContent?.seo);

  const hotCategory = currentLocaleCollections.value.find((collection) => collection.identity === 'hot');
  const newCategory = currentLocaleCollections.value.find((collection) => collection.identity === 'new');

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
