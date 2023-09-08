<template>
  <div>
    <client-only>
      <transition name="fade" mode="out-in">
        <carousel
          v-if="filteredSlider?.length"
          :key="filteredSlider"
          v-bind="topSliderProps"
        >
          <slide v-for="(slide, index) in filteredSlider" :key="index">
            <card-promo v-bind="slide" />
          </slide>

          <template v-slot:addons>
            <navigation />
            <pagination />
          </template>
        </carousel>
      </transition>
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
  import dayjs from 'dayjs';
  import utc from 'dayjs/plugin/utc';
  import isBetween from 'dayjs/plugin/isBetween';
  import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
  import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

  dayjs.extend(utc);
  dayjs.extend(isBetween);
  dayjs.extend(isSameOrAfter);
  dayjs.extend(isSameOrBefore);

  const globalStore = useGlobalStore();
  const profileStore = useProfileStore();
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
  const { isLoggedIn, profile } = storeToRefs(profileStore);

  const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
    useAsyncData('currentLocaleCasinoPageContent', () => queryContent(currentLocale.value?.code as string, 'pages', 'casino').findOne()),
    currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
      : useAsyncData('defaultLocaleCasinoPageContent', () => queryContent(defaultLocale.value?.code as string, 'pages', 'casino').findOne())
  ]);

  const { currentLocaleData } = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  const pageContent: Maybe<ICasinoPage> = currentLocaleData;

  const sliderFilterTime = ref(dayjs.utc());
  const filteredSlider = computed(() => {
    return pageContent?.slider.reduce((filteredSliderArr: ICasinoPage['slider'], currentSlide) => {
      const loggedFilter: boolean = (isLoggedIn.value && currentSlide.loggedHide) || (!isLoggedIn.value && currentSlide.unloggedHide);
      let includesSegmentsFilter: boolean = !!currentSlide.showSegments?.length;
      let excludeSegmentsFilter: boolean = !!currentSlide.hideSegments?.length;
      let timeFilter: boolean = false;

      if (isLoggedIn.value && profile.value) {
        const showSegmentsArr = currentSlide.showSegments?.map(item => item.segmentName) || [];
        const hideSegmentsArr = currentSlide.hideSegments?.map(item => item.segmentName) || [];
        includesSegmentsFilter = showSegmentsArr.length ? !profile.value.segments.some((segment) => showSegmentsArr.includes(segment.name)) : false;
        excludeSegmentsFilter = hideSegmentsArr.length ? profile.value.segments.some((segment) => hideSegmentsArr.includes(segment.name)) : false;
      }

      if (currentSlide.showFrom && currentSlide.showTo) {
        timeFilter = !dayjs(sliderFilterTime.value).isBetween(dayjs(currentSlide.showFrom), dayjs(currentSlide.showTo), 'second');
      } else if (currentSlide.showFrom) {
        timeFilter = !dayjs(sliderFilterTime.value).isSameOrAfter(dayjs(currentSlide.showFrom), 'second');
      } else if (currentSlide.showTo) {
        timeFilter = !dayjs(sliderFilterTime.value).isSameOrBefore(dayjs(currentSlide.showTo), 'second');
      }

      if (loggedFilter || includesSegmentsFilter || excludeSegmentsFilter || timeFilter) return filteredSliderArr;
      return [...filteredSliderArr, currentSlide];
    }, []);
  })

  const fakeStore = useFakeStore();
  const router = useRouter();
  const gameStore = useGamesStore();
  const { currentLocationCollections } = storeToRefs(gameStore);

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

  let sliderTimer: any;
  onMounted(() => {
    sliderTimer = setInterval(() => {
      sliderFilterTime.value = dayjs.utc();
    }, 600000)
  })

  onBeforeUnmount(() => {
    clearInterval(sliderTimer);
  })
</script>
