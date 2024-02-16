<template>
  <div
    class="main-slider"
    ref="sliderNode"
  >
    <div class="main-slider__viewport">
      <div
        v-for="(slide, index) in props.slides"
        class="main-slider__slide"
        :key="index"
      >
        <card-slide v-bind="slide"/>
      </div>
    </div>
    
    <div class="main-slider__bullets">
      <div
        v-for="(item, index) in props.slides.length"
        class="main-slider__bullet"
        :class="{'is-selected': index === selectedIndex}"
        @click="scrollTo(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ISliderItem } from '~/types';
  import emblaCarouselVue from 'embla-carousel-vue';
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
  
  const onSelectSlide = (emblaApi: any) => {
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

<style src="~/assets/styles/components/main-slider.scss" lang="scss"/>

