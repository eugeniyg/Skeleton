<template>
  <div
    class="paysis"
    :class="{'is-logged': isLoggedIn}"
    ref="sliderNode"
  >
    <div class="paysis__container">
      <div class="paysis__item"
        v-for="({ image, display, name }) in paymentsItems"
        :key="name"
      >
        <atomic-image
          v-if="display"
          class="logo"
          :src="image"
          :alt="name"
          @click="paymentsItemClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { IPaymentItem } from '~/types';
  import { storeToRefs } from 'pinia';
  import emblaCarouselVue from 'embla-carousel-vue';
  import Autoplay from 'embla-carousel-autoplay';
  
  const props = defineProps({
    currentLocaleContent: {
      type: Array as PropType<IPaymentItem[]>
    },
    defaultLocaleContent: {
      type: Array as PropType<IPaymentItem[]>
    },
  });
  
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { openDepositModal } = useLayoutStore();
  const { getContent } = useProjectMethods();
  
  const autoplayOptions = {
    delay: 3500,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  };
  
  const [sliderNode] = emblaCarouselVue({
    loop: false,
    align: 'start',
  }, [Autoplay(autoplayOptions)]);
  
  const paymentsItemClick = () => {
    if (isLoggedIn.value) openDepositModal();
  };
  
  const paymentsItems = computed(() => {
    return props.currentLocaleContent?.length ? props.currentLocaleContent : props.defaultLocaleContent;
  });
  
</script>

<style src="~/assets/styles/components/list/paysis.scss" lang="scss"/>

