<template>
  <div>
    <div class="loyalty-rewards-slider" ref="sliderNode">
      <div class="loyalty-rewards-slider__viewport">
        <loyalty-rewards-slider-item
          v-for="level in loyaltyLevels"
          v-bind="level"
          :key="level.name"
        />
      </div>
    </div>
    
    <div
      v-show="levels.length > 1"
      class="loyalty-rewards-slider__nav"
      @mouseover="onMouseOver"
      @mouseleave="onMouseLeave"
    >
      <div
        class="loyalty-rewards-slider__btn is-prev"
        @click="scrollPrev"
      >
        <atomic-icon id="arrow_expand-close"/>
      </div>
      
      <div class="loyalty-rewards-slider__bullets">
        <div
          v-for="(item, index) in levels.length"
          :key="item"
          class="loyalty-rewards-slider__bullet"
          :class="{'is-active': index === activeIndex}"
          @click="scrollTo(index)"
        />
      </div>
      
      <div
        class="loyalty-rewards-slider__btn is-next"
        @click="scrollPrev"
      >
        <atomic-icon id="arrow_expand-close"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { loyaltyLevels } = useFakeStore();
  
  import emblaCarouselVue from 'embla-carousel-vue';
  import Autoplay from 'embla-carousel-autoplay';
  
  const activeIndex = ref<number>(0);
  
  const autoplayOptions = {
    delay: 4000,
    startDelay: 1000,
    stopOnInteraction: false,
    stopOnMouseEnter: false
  };
  
  const levels = [
    {
      type: 'previous',
      name: 'Previous',
      image: '',
      icon: 'flash',
      statusPoints: '139 - 178',
      rankBonus: {
        label: 'Rank bonus',
        value: 0,
        currency: 'USDT',
      },
      cashBack: {
        label: 'Cashback',
        value: 0,
      },
      isActive: true,
      tasks: [
        {
          label: 'Task rewards +50%',
          icon: ''
        },
        {
          label: 'Bonus for reaching a new level',
          icon: ''
        },
        {
          label: 'Monthly boost',
          icon: ''
        },
        {
          label: 'Personal VIP manager',
          icon: ''
        },
      ]
    },
  
  ];
  
  const [sliderNode, emblaApi] = emblaCarouselVue({
    loop: false,
    align: 'center'
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

<style src="~/assets/styles/components/loyalty/rewards-slider.scss" lang="scss"/>
