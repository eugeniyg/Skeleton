<template>
  <div
    v-if="filteredSlides?.length"
    ref="sliderNode"
    class="main-slider"
    :class="`main-slider--${props.sliderType || 'high'}`"
  >
    <div class="main-slider__viewport">
      <div v-for="(slide, index) in filteredSlides" :key="index" class="main-slider__slide">
        <card-slide :slide-data="slide" />
      </div>
    </div>

    <div class="main-slider__bullets">
      <div
        v-for="index in filteredSlides.length"
        :key="index"
        class="main-slider__bullet"
        :class="{ 'is-selected': index === selectedIndex }"
        @click="scrollTo(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ISliderItem } from '~/types';
  import emblaCarouselVue from 'embla-carousel-vue';
  import { storeToRefs } from 'pinia';

  const props = defineProps<{
    sliderType?: 'high' | 'low';
  }>();

  const globalStore = useGlobalStore();
  const { globalComponentsContent } = storeToRefs(globalStore);
  const profileStore = useProfileStore();
  const { isLoggedIn, profile } = storeToRefs(profileStore);
  const selectedIndex = ref<number>(0);

  const [sliderNode, emblaApi] = emblaCarouselVue({
    loop: false,
    align: 'start',
  });

  const onSelectSlide = (emblaApi: any) => {
    selectedIndex.value = emblaApi.selectedScrollSnap();
  };

  const scrollTo = (index: number) => {
    if (!emblaApi.value) return;
    emblaApi.value?.scrollTo(index);
  };

  watchEffect(() => {
    if (emblaApi.value) emblaApi.value.on('select', onSelectSlide);
  });

  const dayjs = useDayjs();
  const sliderFilterTime = ref(dayjs.utc());
  const filteredSlides = computed(() => {
    return globalComponentsContent.value?.slider?.slideList?.reduce(
      (filteredSlidesArr: ISliderItem[], currentSlide) => {
        const loggedFilter: boolean =
          (isLoggedIn.value && currentSlide.loggedHide) || (!isLoggedIn.value && currentSlide.unloggedHide);
        let includesSegmentsFilter: boolean = !!currentSlide.showSegments?.length;
        let excludeSegmentsFilter: boolean = !!currentSlide.hideSegments?.length;
        let timeFilter: boolean = false;

        if (isLoggedIn.value && profile.value) {
          const showSegmentsArr = currentSlide.showSegments?.map(item => item.segmentName) || [];
          const hideSegmentsArr = currentSlide.hideSegments?.map(item => item.segmentName) || [];
          includesSegmentsFilter = showSegmentsArr.length
            ? ![].some(segment => showSegmentsArr.includes(segment))
            : false; // TODO: add segments check
          excludeSegmentsFilter = hideSegmentsArr.length
            ? [].some(segment => hideSegmentsArr.includes(segment))
            : false; // TODO: add segments check
        }

        if (currentSlide.showFrom && currentSlide.showTo) {
          timeFilter = !dayjs(sliderFilterTime.value).isBetween(
            dayjs(currentSlide.showFrom),
            dayjs(currentSlide.showTo),
            'second'
          );
        } else if (currentSlide.showFrom) {
          timeFilter = !dayjs(sliderFilterTime.value).isSameOrAfter(dayjs(currentSlide.showFrom), 'second');
        } else if (currentSlide.showTo) {
          timeFilter = !dayjs(sliderFilterTime.value).isSameOrBefore(dayjs(currentSlide.showTo), 'second');
        }

        if (loggedFilter || includesSegmentsFilter || excludeSegmentsFilter || timeFilter) return filteredSlidesArr;
        return [...filteredSlidesArr, currentSlide];
      },
      []
    );
  });

  let sliderTimer: any;
  onMounted(() => {
    sliderTimer = setInterval(() => {
      sliderFilterTime.value = dayjs.utc();
    }, 600000);
  });

  onBeforeUnmount(() => {
    clearInterval(sliderTimer);
  });
</script>

<style src="~/assets/styles/components/main-slider.scss" lang="scss" />
