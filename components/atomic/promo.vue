<template>
  <div class="promo" :class="{ 'promo--without-advantages': !isShowAdvantages }">
    <picture class="promo__picture">
      <source
        :srcset="getContent(props.currentLocaleData, props.defaultLocaleData, 'promo.images.desktop.backgroundImage')"
        media="(min-width: 64rem)"
      />
      <atomic-image
        :src="getContent(props.currentLocaleData, props.defaultLocaleData, 'promo.images.mobile.backgroundImage')"
        class="promo__picture-img"
      />
    </picture>

    <div class="header">
      <div class="title">
        {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'promo.title') }}
      </div>

      <span class="sub-title">
        {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'promo.secondTitle') }}
      </span>

      <span class="sub-title">
        {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'promo.additionalTitle') }}
      </span>
    </div>

    <div v-if="advantagesList?.length && isShowAdvantages" class="items">
      <div v-for="(advantage, index) in advantagesList" :key="index" class="item">
        <atomic-icon :id="advantage.icon" />
        {{ advantage.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IModalsContent } from '~/types';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['registration']>;
    defaultLocaleData: Maybe<IModalsContent['registration']>;
  }>();

  const advantagesList = computed(() => {
    return props.currentLocaleData?.promo?.advantages || [];
  });

  const isShowAdvantages = computed(() => props.currentLocaleData?.promo?.displayAdvantages);
</script>

<style src="~/assets/styles/components/atomic/promo.scss" lang="scss" />
