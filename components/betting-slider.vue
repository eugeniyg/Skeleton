<template>
  <div
    class="betting-slider"
    ref="sliderNode"
  >
    <div class="betting-slider__viewport">
      <div
        v-for="(slide, index) in props.slides"
        class="betting-slider__slide"
        :key="index"
      >
        <card-betting-slide v-bind="slide"/>
      </div>
    </div>
    
    <div class="betting-slider__bullets">
      <div
        v-for="(item, index) in props.slides.length"
        class="betting-slider__bullet"
        :class="{'is-selected': index === selectedIndex}"
        @click="scrollTo(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ISliderItem } from '~/types';
  import emblaCarouselVue from 'embla-carousel-vue';
  import type { EmblaCarouselType } from 'embla-carousel-vue';
  import Autoplay from 'embla-carousel-autoplay';
  
  const props = defineProps<{
    slides: ISliderItem[]
  }>();
  
  const selectedIndex = ref<number>(0);
  
  const autoplayOptions = {
    delay: 4000,
    stopOnInteraction: false,
  };
  
  const [sliderNode, emblaApi] = emblaCarouselVue({
    loop: false,
    align: 'start',
  }, [
    Autoplay(autoplayOptions)
  ]);
  
  const onSelectSlide = (emblaApi: EmblaCarouselType) => {
    selectedIndex.value = emblaApi.selectedScrollSnap();
  };
  
  const scrollTo = (index: number) => {
    if(!emblaApi.value) return;
    emblaApi.value?.scrollTo(index);
  };
  
  watchEffect(() => {
    if (emblaApi.value) emblaApi.value.on('select', onSelectSlide);
  });
</script>

<style src="~/assets/styles/components/betting-slider.scss" lang="scss"/>

