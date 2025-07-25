<template>
  <div class="lotteries-banner">
    <div class="lotteries-banner__container" :style="backgroundGradientVars">
      <div class="lotteries-banner__content">
        <div class="lotteries-banner__title">{{ title }}</div>
        <div class="lotteries-banner__sub-title" v-if="subTitle">{{ subTitle }}</div>
        <div class="lotteries-banner__description">{{ description }}</div>
        <button-base
          class="lotteries-banner__button"
          type="primary"
          size="lg"
        >
          <atomic-icon id="lottery"/>
          <span>{{ buttonLabel }}</span>
        </button-base>
      </div>
      
      <div class="lotteries-banner__info">
        <div class="lotteries-banner__info-header">
          <atomic-image v-if="infoHeaderBgImage" :src="infoHeaderBgImage"/>
          <div class="lotteries-banner__info-header-title">{{ infoHeaderTitle }}</div>
          <div class="lotteries-banner__info-header-sub-title">19.11,2024 - 27.11.24</div>
        </div>
        <div class="lotteries-banner__info-body">
          <div class="lotteries-banner__info-body-title">For every 0.00000001 mBTC</div>
          <div class="lotteries-banner__info-body-sub-title">you will get +1 ticket</div>
          <div class="lotteries-banner__info-divider"/>
          <lotteries-timer/>
        </div>
        <div class="lotteries-banner__info-footer">
          <div class="lotteries-banner__info-footer-title">
            <atomic-icon id="lottery"/>
            <span>You had 3</span>
            <span>of 10 tickets</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ILotteriesPage } from "~/types";
  import { getContent } from "#imports";
  
  const lotteriesContent = ref<Maybe<ILotteriesPage>>(inject('lotteriesContent'));
  const defaultLocaleLotteriesContent = ref<Maybe<ILotteriesPage>>(inject('defaultLocaleLotteriesContent'));
  
  const title = computed(() => getContent(lotteriesContent.value, defaultLocaleLotteriesContent.value, 'banner.title'));
  const subTitle = computed(() => getContent(lotteriesContent.value, defaultLocaleLotteriesContent.value, 'banner.subTitle'));
  const description = computed(() => getContent(lotteriesContent.value, defaultLocaleLotteriesContent.value, 'banner.description'));
  const buttonLabel = computed(() => getContent(lotteriesContent.value, defaultLocaleLotteriesContent.value, 'banner.buttonLabel'));
  
  const backgroundGradientVars = computed(() => {
    const topColor = getContent(
      lotteriesContent.value,
      defaultLocaleLotteriesContent.value,
      'banner.bannerGradient.topColor'
    );
    const bottomColor = getContent(
      lotteriesContent.value,
      defaultLocaleLotteriesContent.value,
      'banner.bannerGradient.bottomColor'
    );
    if (topColor && bottomColor) return `--banner-color-top: ${topColor}; --banner-color-bottom: ${bottomColor})`;
    return null;
  });
  
  const infoHeaderTitle = computed(() => getContent(lotteriesContent.value, defaultLocaleLotteriesContent.value, 'banner.info.headerTitle'));
  const infoHeaderBgImage = computed(() => getContent(lotteriesContent.value, defaultLocaleLotteriesContent.value, 'banner.info.headerBgImage'));
  
</script>

<style src="~/assets/styles/components/lotteries/banner.scss" lang="scss" />