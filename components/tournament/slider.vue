<template>
  <div class="tournament-slider" :class="{ 'is-single': props.content.length === 1 }">
    <div ref="sliderNode" class="tournament-slider__viewport">
      <div class="tournament-slider__container">
        <template v-for="(item, index) in props.content">
          <tournament-card-active v-if="index % 2 === 0" v-bind="item" />
          <tournament-card-finished v-else v-bind="item" />
        </template>
      </div>
    </div>
    
    <div v-show="props.content.length > 1" class="tournament-slider__nav" @mouseover="onMouseOver" @mouseleave="onMouseLeave">
      <div class="tournament-slider__btn tournament-slider__btn--prev" @click="scrollPrev">
        <atomic-icon id="arrow_expand-close" />
      </div>
      
      <div class="tournament-slider__btn tournament-slider__btn--next" @click="scrollNext">
        <atomic-icon id="arrow_expand-close" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ITournamentPage } from '~/types';
  
  import emblaCarouselVue from 'embla-carousel-vue';
  import Autoplay from 'embla-carousel-autoplay';
  
  const props = defineProps<{
    content: ITournamentPage['cards'];
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
    //[Autoplay(autoplayOptions)]
  );
  
  const onSelectSlide = () => {
    activeIndex.value = emblaApi.value?.selectedScrollSnap() || 0;
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

<style src="~/assets/styles/components/tournament/slider.scss" lang="scss" />
