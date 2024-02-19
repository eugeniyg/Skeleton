<template>
  <div
    class="banners"
    :class="{'is-single' : props.items.length === 1}"
  >
    <div
      class="banners__viewport"
      ref="sliderNode"
    >
      <div class="banners__container">
        <card-home
          v-for="(item, itemIndex) in props.items"
          :key="itemIndex"
          v-bind="item"
        />
      </div>
    </div>
    
    <div
      v-show="props.items.length > 1"
      class="banners__nav"
      @mouseover="onMouseOver"
      @mouseleave="onMouseLeave"
    >
      <div
        class="banners__btn banners__btn--prev"
        @click="scrollPrev"
        :class="{'is-disabled': state.prevBtnDisabled}"
      >
        <atomic-icon id="arrow_expand-close"/>
      </div>
      
      <div class="banners__bullets">
        <div
          v-for="(item, index) in props.items.length"
          class="banners__bullet"
          :class="{'is-active': index === state.activeIndex}"
          @click="scrollTo(index)"
        />
      </div>
      
      <div
        class="banners__btn banners__btn--next"
        @click="scrollNext"
        :class="{'is-disabled': state.nextBtnDisabled}"
      >
        <atomic-icon id="arrow_expand-close"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IHomePage } from '~/types';
  
  import emblaCarouselVue from 'embla-carousel-vue';
  import type { EmblaCarouselType } from 'embla-carousel-vue';
  import Autoplay from 'embla-carousel-autoplay';
  
  const props = defineProps<{
    items: IHomePage['banners']
  }>();
  
  const state = reactive({
    activeIndex: 0,
    prevBtnDisabled: false,
    nextBtnDisabled: false,
  });
  
  const autoplayOptions = {
    delay: 4000,
    startDelay: 1000,
    stopOnInteraction: false,
    stopOnMouseEnter: true
  };
  
  const [sliderNode, emblaApi] = emblaCarouselVue({
    loop: false,
    align: 'start'
  }, [
    Autoplay(autoplayOptions)
  ]);
  
  const onSelectSlide = (emblaApi: EmblaCarouselType) => {
    state.activeIndex = emblaApi.selectedScrollSnap();
    togglePrevNextButtons(emblaApi);
  };
  
  const scrollTo = (index: number) => {
    if (!emblaApi.value) return;
    emblaApi.value.scrollTo(index);
  };
  
  const onButtonClick = (emblaApi: EmblaCarouselType) => {
    const { autoplay } = emblaApi?.plugins();
    if (!autoplay) return;
    if (autoplay.options?.stopOnInteraction !== false) autoplay.stop();
  };
  
  const scrollPrev = () => {
    if (!emblaApi.value) return;
    emblaApi.value.scrollPrev();
    if (onButtonClick) onButtonClick(emblaApi.value);
  };
  
  const scrollNext = () => {
    if (!emblaApi.value) return;
    emblaApi.value.scrollNext();
    if (onButtonClick) onButtonClick(emblaApi.value);
  };
  
  const onMouseOver = () => {
    if (!emblaApi.value) return;
    const { autoplay } = emblaApi.value.plugins();
    autoplay?.stop();
  };
  
  const onMouseLeave = () => {
    if (!emblaApi.value) return;
    const { autoplay } = emblaApi.value.plugins();
    autoplay?.play();
  };
  
  const togglePrevNextButtons = (emblaApi: EmblaCarouselType) => {
    state.prevBtnDisabled = !emblaApi.canScrollPrev();
    state.nextBtnDisabled = !emblaApi.canScrollNext();
  };
  
  watchEffect(() => {
    if (emblaApi.value) {
      emblaApi.value
        .on('select', onSelectSlide)
        .on('init', togglePrevNextButtons)
        .on('reInit', togglePrevNextButtons);
    }
  });
</script>

<style src="~/assets/styles/components/banners.scss" lang="scss"/>
