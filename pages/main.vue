<template>
  <div>
    <client-only>
      <carousel v-if="sliderItems?.length || defaultLocaleSliderItems?.length" v-bind="topSliderProps">
        <slide v-for="(slide, index) in sliderItems?.length ? sliderItems : defaultLocaleSliderItems" :key="index">
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

    <atomic-seo-text v-if="mainContent?.seo?.text" v-bind="mainContent.seo.text" />
  </div>
</template>

<script setup lang="ts">
  import 'vue3-carousel/dist/carousel.css';
  import {
    Carousel, Slide, Pagination, Navigation,
  } from 'vue3-carousel';
  import { storeToRefs } from 'pinia';
  import { MainContentInterface, SlideInterface } from '@skeleton/types';

  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent, contentLocalesArray } = storeToRefs(globalStore);
  const {
    localizePath,
    setPageSeo,
    findLocalesContentData,
    getContent,
  } = useProjectMethods();

  const [sliderResponse, mainContentResponse] = await Promise.all([
    useAsyncData('sliderData', () => queryContent('main-slider')
      .where({ locale: { $in: contentLocalesArray.value } }).find()),
    useAsyncData('mainContent', () => queryContent('page-controls')
      .where({ locale: { $in: contentLocalesArray.value } }).only(['locale', 'mainPage']).find()),
  ]);

  const mainContentData = findLocalesContentData(mainContentResponse.data.value);
  const mainContent: Maybe<MainContentInterface> = mainContentData.currentLocaleData?.mainPage;

  const sliderContentData = findLocalesContentData(sliderResponse.data.value);
  const sliderItems: Maybe<SlideInterface[]> = sliderContentData.currentLocaleData?.slider;
  const defaultLocaleSliderItems: Maybe<SlideInterface[]> = sliderContentData.defaultLocaleData?.slider;

  const fakeStore = useFakeStore();
  const router = useRouter();
  const gameStore = useGamesStore();
  const { currentLocaleCollections } = storeToRefs(gameStore);
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);

  const providerCards = fakeStore.providerCards();

  const mainCategories = ['hot', 'slots', 'turbogames', 'new', 'table', 'live'];
  const mainCategoriesData = mainCategories.reduce((categoriesObj, currentCategoryIdentity) => {
    const findCategory = currentLocaleCollections.value.find((collection) => collection.identity === currentCategoryIdentity);
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

  setPageSeo(mainContent?.seo);

  const changeCategory = (categoryId: string) => {
    router.push({ path: localizePath('/games'), query: { category: categoryId } });
  };
</script>
