<template>
  <div
    class="paysis"
    :class="{'is-logged': isLoggedIn}"
    ref="sliderNode"
    v-if="paymentsItems?.length"
  >
    <div class="paysis__container">
      <div class="paysis__item" v-for="{ image } in paymentsItems">
        <atomic-image
          class="logo"
          :src="image"
          @click="paymentsItemClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import emblaCarouselVue from 'embla-carousel-vue';
  import Autoplay from 'embla-carousel-autoplay';
  
  const { layoutData, defaultLocaleLayoutData } = useGlobalStore();
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
    return layoutData?.footer?.paymentsList?.length ? layoutData?.footer?.paymentsList : defaultLocaleLayoutData?.footer?.paymentsList;
  });
  
</script>

<style src="~/assets/styles/components/list/paysis.scss" lang="scss"/>

