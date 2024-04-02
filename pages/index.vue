<template>
  <div class="home">
    <banners
      v-if="homeContent?.banners || defaultLocaleHomeContent?.banners"
      :items="homeContent?.banners || defaultLocaleHomeContent?.banners"
    />
    
    <div
      v-if="homeContent?.categories || defaultLocaleHomeContent?.categories"
      class="card-category__container"
      :class="cardsModifier">
      <card-category
        v-for="(item, itemIndex) in (homeContent?.categories || defaultLocaleHomeContent?.categories)"
        :key="itemIndex"
        :mod="itemIndex + 1"
        v-bind="item"
      />
    </div>

      <!--<group-benefits/>-->
    
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

    <group-games
      v-if="liveCasinoCategory"
      showAllBtn
      showArrows
      :category="liveCasinoCategory"
    />

    <div
      ref="sportsContainer"
      class="sports-container"
      @inview="startBetsyWidgets"
    >
      <div id="top-events-widget" />
      <div id="live-events-widget" />
    </div>

    <group-providers showArrows />

    <group-promotions />

    <atomic-seo-text v-if="homeContent?.pageMeta?.seoText" v-bind="homeContent.pageMeta.seoText"/>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IHomePage } from '~/types';

  const globalStore = useGlobalStore();
  const gameStore = useGamesStore();
  const { currentLocationCollections } = storeToRefs(gameStore);
  const {
    currentLocale,
    defaultLocale
  } = storeToRefs(globalStore);

  const {
    setPageMeta,
    localizePath,
    getContent,
    getLocalesContentData,
    addBetsyScript
  } = useProjectMethods();

  const homeContent = ref<Maybe<IHomePage>>();
  const defaultLocaleHomeContent = ref<Maybe<IHomePage>>();

  interface IPageContent {
    currentLocaleData: Maybe<IHomePage>;
    defaultLocaleData: Maybe<IHomePage>;
  }

  const setContentData = (contentData: Maybe<IPageContent>): void => {
    homeContent.value = contentData?.currentLocaleData;
    defaultLocaleHomeContent.value = contentData?.defaultLocaleData;
    setPageMeta(homeContent.value?.pageMeta);
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const nuxtContentData = useNuxtData('homePageContent');
    if (nuxtContentData.data.value) return nuxtContentData.data.value;

    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'pages', 'home').findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'pages', 'home').findOne()
    ]);
    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  }

  const { pending, data } = await useLazyAsyncData('homePageContent', () => getPageContent());
  if (data.value) setContentData(data.value);

  watch(data, () => {
    setContentData(data.value);
  })

  const topSlotsCategory = currentLocationCollections.value.find((collection) => collection.identity === 'top-slots');
  const liveCasinoCategory = currentLocationCollections.value.find((collection) => collection.identity === 'liveshow');
  const aeroCategory = computed(() => currentLocationCollections.value.find((collection) => collection.identity === homeContent.value?.aeroGroup?.collectionIdentity));

  const cardsModifier = computed(() => {
    const length = Object.keys(getContent(homeContent.value, defaultLocaleHomeContent.value, 'categories'))?.length || 0
    return length  ? `has-${length}-cards` : ''
  });

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
    } else {
      const betsyScript = addBetsyScript();
      betsyScript.onload = () => {
        window.BetSdk.initTopEventsWidget({ ...widgetsParams, containerId: 'top-events-widget' });
        window.BetSdk.initLiveEventsWidget({ ...widgetsParams, containerId: 'live-events-widget' });
      };
    }
  };

  const sportsContainer = ref();
  const { initObserver } = useProjectMethods();
  const widgetsObserver = ref();

  onMounted(() => {
    if (window.BetSdk) startBetsyWidgets();
    else {
      widgetsObserver.value = initObserver({
        once: true,
        settings: { root: null, rootMargin: '400px', threshold: 0 },
      });
      widgetsObserver.value.observe(sportsContainer.value);
    }
  });

  onBeforeUnmount(() => {
    if (sportsContainer.value && widgetsObserver.value) {
      widgetsObserver.value.unobserve(sportsContainer.value);
    }
  })
</script>

<style src="~/assets/styles/pages/index.scss" lang="scss" />

