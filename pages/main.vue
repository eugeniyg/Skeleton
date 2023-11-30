<template>
  <div>
    <main-slider v-if="filteredSlider?.length" :slides="filteredSlider"/>
    
    <nav-cat @clickCategory="changeCategory"/>
    
    <group-games
      v-for="category in mainCategoriesList.slice(0, 3)"
      showAllBtn
      showArrows
      :category="category"
    />

    <group-providers showArrows />

    <group-games
      v-for="category in mainCategoriesList.slice(3, 4)"
      showAllBtn
      showArrows
      :category="category"
    />
    
    <group-winners showArrows/>
    
    <group-games
      v-for="category in mainCategoriesList.slice(4)"
      showAllBtn
      showArrows
      :category="category"
    />
    
    <favorite-recently v-if="isLoggedIn"/>

    <atomic-seo-text v-if="pageContent?.seo?.text" v-bind="pageContent.seo.text"/>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { ICasinoPage } from '~/types';
  import type { ICollection } from '@skeleton/core/types';
  
  const globalStore = useGlobalStore();
  const profileStore = useProfileStore();
  const {
    currentLocale,
    defaultLocale
  } = storeToRefs(globalStore);
  const {
    localizePath,
    setPageSeo,
    getLocalesContentData
  } = useProjectMethods();
  const { isLoggedIn, profile } = storeToRefs(profileStore);

  let pageContent: Maybe<ICasinoPage>;
  let defaultLocalePageContent: Maybe<ICasinoPage>;
  const [nuxtCurrentLocaleData, nuxtDefaultLocaleData] = [
    useNuxtData('currentLocaleCasinoPageContent'),
    useNuxtData('defaultLocaleCasinoPageContent')
  ]

  if (nuxtCurrentLocaleData.data.value || nuxtDefaultLocaleData.data.value) {
    pageContent = nuxtCurrentLocaleData.data.value;
    defaultLocalePageContent = nuxtDefaultLocaleData.data.value;
  } else {
    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      useAsyncData('currentLocaleCasinoPageContent', () => queryContent(currentLocale.value?.code as string, 'pages', 'casino').findOne()),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : useAsyncData('defaultLocaleCasinoPageContent', () => queryContent(defaultLocale.value?.code as string, 'pages', 'casino').findOne())
    ]);

    const { currentLocaleData, defaultLocaleData } = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
    pageContent = currentLocaleData;
    defaultLocalePageContent = defaultLocaleData;
  }

  const dayjs = useDayjs();
  const sliderFilterTime = ref(dayjs.utc());
  const filteredSlider = computed(() => {
    return pageContent?.slider?.reduce((filteredSliderArr: ICasinoPage['slider'], currentSlide) => {
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

  const router = useRouter();
  const gameStore = useGamesStore();
  const { currentLocationCollections } = storeToRefs(gameStore);

  const mainCategoriesList = currentLocationCollections.value.reduce((categoriesArr: ICollection[], currentCategory) => {
    return currentCategory.isHidden ? categoriesArr : [...categoriesArr, currentCategory];
  }, []);
  
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
