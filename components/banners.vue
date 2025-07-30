<template>
  <div class="banners" :class="{ 'is-single': props.items.length === 1 }">
    <div ref="sliderNode" class="banners__viewport">
      <div class="banners__container">
        <card-home
          v-for="(item, itemIndex) in props.items"
          :key="itemIndex"
          v-bind="item"
          :banner-loyalty="props.bannerLoyalty"
        />
      </div>
    </div>

    <div v-show="props.items.length > 1" class="banners__nav" @mouseover="onMouseOver" @mouseleave="onMouseLeave">
      <div class="banners__btn banners__btn--prev" @click="scrollPrev">
        <atomic-icon id="arrow-expand-close" />
      </div>

      <div class="banners__bullets">
        <div
          v-for="(item, index) in props.items.length"
          :key="index"
          class="banners__bullet"
          :class="{ 'is-active': index === activeIndex }"
          @click="scrollTo(index)"
        />
      </div>

      <div class="banners__btn banners__btn--next" @click="scrollNext">
        <atomic-icon id="arrow-expand-close" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IHomePage } from '~/types';

  import emblaCarouselVue from 'embla-carousel-vue';
  import Autoplay from 'embla-carousel-autoplay';

  const props = defineProps<{
    items: IHomePage['banners'];
    bannerLoyalty?: IHomePage['bannerLoyalty'];
  }>();

  const activeIndex = ref<number>(0);

  const autoplayOptions = {
    delay: 4000,
    startDelay: 1000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  };

  const [sliderNode, emblaApi] = emblaCarouselVue(
    {
      loop: false,
      align: 'start',
    },
    [Autoplay(autoplayOptions)]
  );

  const onSelectSlide = () => {
    activeIndex.value = emblaApi.value?.selectedScrollSnap() || 0;
  };

  const scrollTo = (index: number) => {
    emblaApi.value?.scrollTo(index);
  };

  const scrollPrev = () => {
    if (!emblaApi.value?.canScrollPrev()) {
      emblaApi.value?.scrollTo(emblaApi.value?.slideNodes()?.length);
      onSelectSlide();
    } else {
      emblaApi.value?.scrollPrev();
    }
  };

  const scrollNext = () => {
    if (!emblaApi.value?.canScrollNext()) {
      emblaApi.value?.scrollTo(0);
      onSelectSlide();
    } else {
      emblaApi.value?.scrollNext();
    }
  };

  const onMouseOver = () => {
    const autoplay = emblaApi.value?.plugins()?.autoplay as any;
    autoplay?.stop();
  };

  const onMouseLeave = () => {
    if (!emblaApi.value) return;
    const autoplay = emblaApi.value?.plugins()?.autoplay as any;
    autoplay?.play();
  };

  watchEffect(() => {
    if (emblaApi.value) {
      emblaApi.value?.on('select', onSelectSlide);
    }
  });
</script>

<style src="~/assets/styles/components/banners.scss" lang="scss" />
