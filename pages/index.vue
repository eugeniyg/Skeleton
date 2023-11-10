<template>
  <div class="home">
    <div v-if="homeContent?.banner || defaultLocaleHomeContent?.banner" class="promo-card-wrapper">
      <card-home v-bind="homeContent?.banner || defaultLocaleHomeContent?.banner"/>
    </div>

    <div class="cards-wrap">
      <div
        class="cards-cat"
        :class="cardsModifier"
        v-if="homeContent?.categories || defaultLocaleHomeContent?.categories"
      >
        <card-category
          v-for="(item, itemIndex) in Object.keys(homeContent?.categories || defaultLocaleHomeContent?.categories)"
          :key="itemIndex"
          :mod="item"
          v-bind="homeContent?.categories?.[item] || defaultLocaleHomeContent?.categories?.[item]"
        />
      </div>

      <!--<group-benefits/>-->
    </div>

    <group-aero
      v-if="homeContent?.aeroGroup?.display && aeroCategory"
      showAllBtn
      showArrows
      :category="aeroCategory"
      :currentLocaleContent="homeContent?.aeroGroup"
      :defaultLocaleContent="defaultLocaleHomeContent?.aeroGroup"
    />

    <group-games
      v-if="topSlotsCategory"
      showAllBtn
      showArrows
      :category="topSlotsCategory"
    />

    <div ref="sportsContainer" class="sports-container">
      <div id="top-events-widget" />
      <div id="live-events-widget" />
    </div>

    <group-games
      v-if="liveCasinoCategory"
      showAllBtn
      showArrows
      :category="liveCasinoCategory"
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

    <group-promotions />

    <atomic-seo-text v-if="homeContent?.seo?.text" v-bind="homeContent.seo.text"/>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import {IHomePage} from '~/types';

  const globalStore = useGlobalStore();
  const gameStore = useGamesStore();
  const fakeStore = useFakeStore();
  const providerCards = fakeStore.providerCards();
  const { currentLocationCollections } = storeToRefs(gameStore);
  const {
    currentLocale,
    defaultLocale,
    globalComponentsContent,
    defaultLocaleGlobalComponentsContent
  } = storeToRefs(globalStore);

  const {
    setPageSeo,
    localizePath,
    getContent,
    getLocalesContentData,
    addBetsyScript
  } = useProjectMethods();

  const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
    useAsyncData('currentLocaleHomePageContent', () => queryContent(currentLocale.value?.code as string, 'pages', 'home').findOne()),
    currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
      : useAsyncData('defaultLocaleHomePageContent', () => queryContent(defaultLocale.value?.code as string, 'pages', 'home').findOne())
  ]);

  const { currentLocaleData, defaultLocaleData } = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  const homeContent: Maybe<IHomePage> = currentLocaleData;
  const defaultLocaleHomeContent: Maybe<IHomePage> = defaultLocaleData
  setPageSeo(homeContent?.seo);

  const topSlotsCategory = currentLocationCollections.value.find((collection) => collection.identity === 'top-slots');
  const liveCasinoCategory = currentLocationCollections.value.find((collection) => collection.identity === 'liveshow');
  const aeroCategory = currentLocationCollections.value.find((collection) => collection.identity === homeContent?.aeroGroup?.collectionIdentity);

  const cardsModifier = computed(() => {
    const length = Object.keys(getContent(homeContent, defaultLocaleHomeContent, 'categories'))?.length || 0
    return length > 2 ? `cards-cat--${length}` : ''
  });

  const startBetsyWidgets = ():void => {
    console.log('hello');
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
    } else {
      const betsyScript = addBetsyScript();
      betsyScript.onload = () => {
        window.BetSdk.initTopEventsWidget({ ...widgetsParams, containerId: 'top-events-widget' });
        window.BetSdk.initLiveEventsWidget({ ...widgetsParams, containerId: 'live-events-widget' });
      };
    }
  };

  const sportsContainer = ref();
  onMounted(() => {
    if (window.BetSdk) startBetsyWidgets();
    else {
      const { initObserver } = useProjectMethods();
      initObserver(sportsContainer.value, {
        once: true,
        onInView: startBetsyWidgets,
        settings: { root: null, rootMargin: '0px 0px 200px 0px', threshold: 0 },
      });
    }
  });

</script>

<style src="~/assets/styles/pages/index.scss" lang="scss" />

