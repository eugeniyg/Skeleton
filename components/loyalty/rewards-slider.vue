<template>
  
  <div>
  <div class="loyalty-rewards-slider">
    <div class="loyalty-rewards-slider__viewport" ref="sliderNode">
      <div class="loyalty-rewards-slider__container">
          <layalty-reward-slider-item
            v-for="(item, itemIndex) in slideData"
            :key="itemIndex"
            v-bind="item"
          />
        </div>
      </div>
    </div>
    
    <div
      v-show="props.items.length > 1"
      class="loyalty-rewards-slider__nav"
      @mouseover="onMouseOver"
      @mouseleave="onMouseLeave"
    >
      <div class="loyalty-rewards-slider__bullets">
        <div
          v-for="(item, index) in props.items.length"
          class="banners__bullet"
          :class="{'is-active': index === activeIndex}"
          @click="scrollTo(index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ILoyaltyPage } from '~/types';
  
  import emblaCarouselVue from 'embla-carousel-vue';
  import Autoplay from 'embla-carousel-autoplay';
  
  const props = defineProps<{
    content: ILoyaltyPage['rewards']['slider']
  }>();
  
  const activeIndex = ref<number>(0);
  
  const autoplayOptions = {
    delay: 4000,
    startDelay: 1000,
    stopOnInteraction: false,
    stopOnMouseEnter: true
  };
  
  const slideData = [
    {
      level: 3,
      statusPoints: '128 - 178',
      rankBonus: 4,
    },
  ];
  
  const [sliderNode, emblaApi] = emblaCarouselVue({
    loop: false,
    align: 'start'
  }, [Autoplay(autoplayOptions)]);
  
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

<!--<style src="~/assets/styles/components/banners.scss" lang="scss"/>-->
