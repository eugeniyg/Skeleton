<template>
  <div>
    <client-only>
      <carousel v-if="sliderItems?.length" v-bind="topSliderProps">
        <slide v-for="(slide, index) in sliderItems" :key="index">
          <card-promo v-if="slide.slideStatus === 'Published'" v-bind="slide" />
        </slide>

        <template v-slot:addons>
          <navigation />
          <pagination />
        </template>
      </carousel>
    </client-only>

    <nav-cat @clickCategory="changeCategory" />

    <favorite-recently v-if="isLoggedIn" />

    <group-games
      v-if="mainCategoriesData.hot"
      showAllBtn
      showArrows
      :category="mainCategoriesData.hot"
    />

    <group-games
      v-if="mainCategoriesData.slots"
      showAllBtn
      showArrows
      :category="mainCategoriesData.slots"
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

    <group-games
      v-if="mainCategoriesData.turbogames"
      showAllBtn
      showArrows
      :category="mainCategoriesData.turbogames"
    />

    <group-games
      v-if="mainCategoriesData.new"
      showAllBtn
      showArrows
      :category="mainCategoriesData.new"
    />

    <group-winners showArrows />

    <group-games
      v-if="mainCategoriesData.table"
      showAllBtn
      showArrows
      :category="mainCategoriesData.table"
    />

    <group-games
      v-if="mainCategoriesData.live"
      showAllBtn
      showArrows
      :category="mainCategoriesData.live"
    />

    <group-promotions v-if="globalComponentsContent?.promotions" v-bind="globalComponentsContent.promotions" />

    <!-- <cards-group v-bind="fakeStore.newRelisesCards">
      <template v-slot:card="item">
        <card-base v-bind="item" />
      </template>
    </cards-group> -->

    <atomic-seo-text v-if="pageContent?.seo?.text" v-bind="pageContent.seo.text" />
  </div>
</template>

<script setup lang="ts">
  import 'vue3-carousel/dist/carousel.css';
  import {
    Carousel, Slide, Pagination, Navigation,
  } from 'vue3-carousel';
  import { storeToRefs } from 'pinia';
  import { ICasinoPage } from '~/types';

  const globalStore = useGlobalStore();
  const {
    globalComponentsContent,
    defaultLocaleGlobalComponentsContent,
    currentLocale,
    defaultLocale
  } = storeToRefs(globalStore);
  const {
    localizePath,
    setPageSeo,
    getLocalesContentData,
    getContent,
  } = useProjectMethods();

  const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
    useAsyncData('currentLocaleCasinoPageContent', () => queryContent(currentLocale.value?.code as string, 'pages', 'casino').findOne()),
    currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
      : useAsyncData('defaultLocaleCasinoPageContent', () => queryContent(defaultLocale.value?.code as string, 'pages', 'casino').findOne())
  ]);

  const { currentLocaleData, defaultLocaleData } = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  const pageContent: Maybe<ICasinoPage> = currentLocaleData;
  const defaultLocalePageContent: Maybe<ICasinoPage> = defaultLocaleData;

  const sliderItems: Maybe<ICasinoPage['slider']> = pageContent?.slider || defaultLocalePageContent?.slider;

  const fakeStore = useFakeStore();
  const router = useRouter();
  const gameStore = useGamesStore();
  const { currentLocationCollections } = storeToRefs(gameStore);
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);

  const providerCards = fakeStore.providerCards();

  const mainCategories = ['hot', 'slots', 'turbogames', 'new', 'table', 'live'];
  const mainCategoriesData = mainCategories.reduce((categoriesObj, currentCategoryIdentity) => {
    const findCategory = currentLocationCollections.value.find((collection) => collection.identity === currentCategoryIdentity);
    return findCategory ? { ...categoriesObj, [currentCategoryIdentity]: findCategory } : categoriesObj;
  }, {});

  const topSliderProps = {
    settings: {
      itemsToShow: 1,
      pauseAutoplayOnHover: true,
      itemsToScroll: 1,
      autoplay: 3000,
      transition: 500,
      wrapAround: true,
    },
  };

  setPageSeo(pageContent?.seo);

  const changeCategory = (categoryId: string) => {
    router.push({ path: localizePath('/games'), query: { category: categoryId } });
  };
</script>
