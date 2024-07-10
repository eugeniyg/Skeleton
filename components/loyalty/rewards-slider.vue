<template>
  <div
    class="loyalty-rewards-slider__wrap"
    :class="{
    'is-centered': isCentered,
    'is-prev-disabled': isPrevDisabled,
    'is-next-disabled': isNextDisabled,
    }"
  >
    <div
      class="loyalty-rewards-slider"
      ref="sliderNode"
    >
      <div class="loyalty-rewards-slider__viewport">
        <loyalty-rewards-slider-item
          v-for="level in loyaltyLevels"
          v-bind="level"
          :key="level.name"
        />
      </div>
    </div>
    
    <div class="loyalty-rewards-slider__btn is-prev" @click="scrollPrev">
      <atomic-icon id="arrow_expand-close"/>
    </div>
    
    <div class="loyalty-rewards-slider__btn is-next" @click="scrollNext">
      <atomic-icon id="arrow_expand-close"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { loyaltyLevels } = useFakeStore();
  
  import emblaCarouselVue from 'embla-carousel-vue';
  //import Autoplay from 'embla-carousel-autoplay';
  
  const activeIndex = ref<number>(0);
  const isPrevDisabled = ref<boolean>(false);
  const isNextDisabled = ref<boolean>(false);
  const slidesInView = ref<number[]>([]);
  
  // const autoplayOptions = {
  //   delay: 4000,
  //   startDelay: 1000,
  //   stopOnInteraction: false,
  //   stopOnMouseEnter: true
  // };
  
  const [sliderNode, emblaApi] = emblaCarouselVue({
      loop: false,
      align: 'center'
    },
    //[Autoplay(autoplayOptions)]
  );
  
  const isCentered = computed(() => isPrevDisabled.value && isNextDisabled.value);
  
  const togglePrevNextButtons = () => {
    isPrevDisabled.value = !emblaApi.value?.canScrollPrev();
    isNextDisabled.value = !emblaApi.value?.canScrollNext();
  };
  
  const onSelectSlide = () => {
    togglePrevNextButtons();
  };
  
  const scrollPrev = () => {
    emblaApi.value?.scrollPrev();
  };
  
  const scrollNext = () => {
    emblaApi.value?.scrollNext();
  };
  
  watchEffect(() => {
    if (emblaApi.value) {
      emblaApi.value?.on('select', onSelectSlide);
      emblaApi.value?.on('resize', togglePrevNextButtons);
      togglePrevNextButtons();
    }
  });
</script>

<style src="~/assets/styles/components/loyalty/rewards-slider.scss" lang="scss"/>
