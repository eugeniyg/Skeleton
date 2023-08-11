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

    <div class="sports-container">
      <div id="top-events-widget" />
      <div id="live-events-widget" />
    </div>

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
  import { HomeContentInterface } from '@skeleton/types';

  const globalStore = useGlobalStore();
  const gameStore = useGamesStore();
  const fakeStore = useFakeStore();
  const providerCards = fakeStore.providerCards();
  const { currentLocationCollections } = storeToRefs(gameStore);
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

  const hotCategory = currentLocationCollections.value.find((collection) => collection.identity === 'hot');
  const newCategory = currentLocationCollections.value.find((collection) => collection.identity === 'new');

  const startBetsyWidgets = ():void => {
    const runtimeConfig = useRuntimeConfig();
    const mainHost = window.location.origin;
    const widgetsParams = {
      host: runtimeConfig.public.betsyParams?.clientHost,
      cid: runtimeConfig.public.betsyParams?.clientId,
      theme: runtimeConfig.public.betsyParams?.widgetTheme,
      customStyles: runtimeConfig.public.betsyParams?.widgetStyles ? `${mainHost}${runtimeConfig.public.betsyParams.widgetStyles}` : undefined,
      mainFrameUrl: mainHost + localizePath('/betting'),
      lang: currentLocale.value?.code || 'en',
      height: '372px',
    }

    if (window.BetSdk) {
      window.BetSdk.initTopEventsWidget({ ...widgetsParams, containerId: 'top-events-widget' });
      window.BetSdk.initLiveEventsWidget({ ...widgetsParams, containerId: 'live-events-widget' });
    }
  };

  onMounted(() => {
    startBetsyWidgets();
  });
</script>

<style src="~/assets/styles/pages/index.scss" lang="scss" />

