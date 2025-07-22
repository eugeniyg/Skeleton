<template>
  <div class="home">
    <banners
      v-if="pageContent?.currentLocaleData?.banners || pageContent?.defaultLocaleData?.banners"
      :items="pageContent?.currentLocaleData?.banners || pageContent?.defaultLocaleData?.banners"
      :banner-loyalty="pageContent?.currentLocaleData?.bannerLoyalty || pageContent?.defaultLocaleData?.bannerLoyalty"
    />

    <div
      v-if="pageContent?.currentLocaleData?.categories || pageContent?.defaultLocaleData?.categories"
      class="card-category__container"
      :class="cardsModifier"
    >
      <card-category
        v-for="(item, itemIndex) in pageContent?.currentLocaleData?.categories ||
        pageContent?.defaultLocaleData?.categories"
        :key="itemIndex"
        :mod="itemIndex + 1"
        v-bind="item"
      />
    </div>

    <!--<group-benefits/>-->

    <group-aero
      v-if="pageContent?.currentLocaleData?.aeroGroup?.display && aeroCategory"
      show-all-btn
      show-arrows
      :category="aeroCategory"
      :current-locale-content="pageContent?.currentLocaleData?.aeroGroup"
      :default-locale-content="pageContent?.defaultLocaleData?.aeroGroup"
    />

    <template v-for="collection in gameCollectionsList">
      <group-games v-if="collection" :key="collection.id" show-all-btn show-arrows :category="collection" />
    </template>

    <div v-if="hasBetsyIntegration" ref="sportsContainer" class="sports-container" @inview="startBetsyWidgets">
      <div id="top-events-widget" />
      <div id="live-events-widget" />
    </div>

    <group-providers show-arrows show-all-btn />

    <activity-board
      v-if="activityBoardContent.showBlock && activityBoardContent.boards.length"
      v-bind="activityBoardContent"
    />

    <group-promotions />

    <atomic-seo-text
      v-if="pageContent?.currentLocaleData?.pageMeta?.seoText"
      v-bind="pageContent.currentLocaleData.pageMeta.seoText"
    />
  </div>
</template>

<script setup lang="ts">
  import type { IHomePage } from '~/types';
  import type { ICollection } from '@skeleton/api/types';
  import { addBetsyScript } from '@skeleton/helpers/transformDomMethods';
  import { initObserver } from '@skeleton/helpers/observer';

  const globalStore = useGlobalStore();
  const { currentLocale } = storeToRefs(globalStore);

  const contentParams = {
    contentKey: 'homePageContent',
    contentCollection: 'pages',
    contentSource: 'home',
    isPage: true,
  };
  const { getContentData } = useContentLogic<IHomePage>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(contentParams.contentKey, getContentData);
  const { collectionsByCountry } = useGamesStore();

  const aeroCategory = collectionsByCountry.find(
    collection => collection.identity === pageContent.value?.currentLocaleData?.aeroGroup?.collectionIdentity
  );

  const targetGameCollections = computed(() => {
    return (
      getContent(pageContent.value?.currentLocaleData, pageContent.value?.defaultLocaleData, 'gameCollections')?.map(
        (item: ICollection) => item.identity
      ) || []
    );
  });

  const gameCollectionsList = computed(() =>
    collectionsByCountry
      .filter(collection => targetGameCollections.value.includes(collection.identity))
      .sort((a, b) => {
        return targetGameCollections.value?.indexOf(a.identity) - targetGameCollections.value?.indexOf(b.identity);
      })
  );

  const cardsModifier = computed(() => {
    const length =
      Object.keys(getContent(pageContent.value?.currentLocaleData, pageContent.value?.defaultLocaleData, 'categories'))
        ?.length || 0;
    return length ? `has-${length}-cards` : '';
  });

  const startBetsyWidgets = (): void => {
    const runtimeConfig = useRuntimeConfig();
    const mainHost = window.location.origin;
    const widgetsParams = {
      host: runtimeConfig.public.betsyParams?.clientHost,
      cid: runtimeConfig.public.betsyParams?.clientId,
      theme: runtimeConfig.public.betsyParams?.widgetTheme,
      customStyles: runtimeConfig.public.betsyParams?.widgetStyles
        ? `${mainHost}${runtimeConfig.public.betsyParams.widgetStyles}`
        : undefined,
      mainFrameUrl: mainHost + localizePath('/betting'),
      lang: currentLocale.value?.code || 'en',
      height: '372px',
    };

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

  const runtimeConfig = useRuntimeConfig();
  const hasBetsyIntegration =
    runtimeConfig.public.betsyParams?.clientHost && runtimeConfig.public.betsyParams?.clientId;
  const sportsContainer = ref();
  const widgetsObserver = ref();

  const initBetsy = (): void => {
    if (!hasBetsyIntegration) return;

    if (window.BetSdk) startBetsyWidgets();
    else {
      widgetsObserver.value = initObserver({
        once: true,
        settings: { root: null, rootMargin: '400px', threshold: 0 },
      });
      widgetsObserver.value.observe(sportsContainer.value);
    }
  };

  const activityBoardContent = computed(() => {
    const currentLocaleBoardContent = pageContent.value?.currentLocaleData?.activityBoard;
    const defaultLocaleBoardContent = pageContent.value?.defaultLocaleData?.activityBoard;
    return {
      showBlock: currentLocaleBoardContent?.showBlock,
      title: currentLocaleBoardContent?.title || defaultLocaleBoardContent?.title,
      icon: currentLocaleBoardContent?.icon || defaultLocaleBoardContent?.icon,
      columns: currentLocaleBoardContent?.columns || defaultLocaleBoardContent?.columns,
      boards: currentLocaleBoardContent?.boards?.length
        ? currentLocaleBoardContent.boards
        : defaultLocaleBoardContent?.boards || [],
    };
  });

  onMounted(async () => {
    initBetsy();
  });

  onBeforeUnmount(() => {
    if (sportsContainer.value && widgetsObserver.value) {
      widgetsObserver.value.unobserve(sportsContainer.value);
    }
  });
</script>

<style src="~/assets/styles/pages/index.scss" lang="scss" />
