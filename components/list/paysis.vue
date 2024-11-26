<template>
  <div v-if="paymentsItems?.length" ref="sliderNode" class="paysis" :class="{ 'is-logged': isLoggedIn }">
    <div class="paysis__container">
      <div v-for="({ image }, index) in paymentsItems" :key="index" class="paysis__item">
        <atomic-image class="logo" :src="image" @click="paymentsItemClick" />
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
  const { openWalletModal } = useModalStore();

  const autoplayOptions = {
    delay: 3500,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  };

  const [sliderNode] = emblaCarouselVue(
    {
      loop: false,
      align: 'start',
    },
    [Autoplay(autoplayOptions)]
  );

  const paymentsItemClick = () => {
    if (isLoggedIn.value) openWalletModal('deposit');
  };

  const paymentsItems = computed(() => {
    return layoutData?.footer?.paymentsList?.length
      ? layoutData?.footer?.paymentsList
      : defaultLocaleLayoutData?.footer?.paymentsList;
  });
</script>

<style src="~/assets/styles/components/list/paysis.scss" lang="scss" />
