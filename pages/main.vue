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

  const pageContent = ref<Maybe<ICasinoPage>>();
  const defaultLocalePageContent = ref<Maybe<ICasinoPage>>();

  interface IPageContent {
    currentLocaleData: Maybe<ICasinoPage>;
    defaultLocaleData: Maybe<ICasinoPage>;
  }

  const setContentData = (contentData: Maybe<IPageContent>): void => {
    pageContent.value = contentData?.currentLocaleData;
    defaultLocalePageContent.value = contentData?.defaultLocaleData;
    setPageSeo(pageContent.value?.seo);
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const nuxtContentData = useNuxtData('casinoPageContent');
    if (nuxtContentData.data.value) return nuxtContentData.data.value;

    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'pages', 'casino').findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'pages', 'casino').findOne()
    ]);
    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  }

  const { pending, data } = await useLazyAsyncData('casinoPageContent', () => getPageContent());
  if (data.value) setContentData(data.value);

  watch(data, () => {
    setContentData(data.value);
  })

  const dayjs = useDayjs();
  const sliderFilterTime = ref(dayjs.utc());
  const filteredSlider = computed(() => {
    return pageContent.value?.slider?.reduce((filteredSliderArr: ICasinoPage['slider'], currentSlide) => {
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
