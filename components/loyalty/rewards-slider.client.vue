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
          v-for="level in props.levels"
          :level="level"
          :key="level.id"
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
  import type { ILoyaltyLevel } from "@skeleton/core/types";
  import emblaCarouselVue from 'embla-carousel-vue';

  const props = defineProps<{
    levels: ILoyaltyLevel[];
  }>();

  const isPrevDisabled = ref<boolean>(true);
  const isNextDisabled = ref<boolean>(true);

  const [sliderNode, emblaApi] = emblaCarouselVue({
      loop: false,
      align: 'center'
    },
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