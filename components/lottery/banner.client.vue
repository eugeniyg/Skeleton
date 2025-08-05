<template>
  <div class="lottery-banner">
    <div class="lottery-banner__container" :style="backgroundGradientVars">
      <div class="lottery-banner__content">
        <div class="lottery-banner__title">{{ title }}</div>
        <div class="lottery-banner__sub-title" v-if="subTitle">{{ subTitle }}</div>
        <div class="lottery-banner__description" v-html="description"/>
        <button-base
          class="lottery-banner__button"
          type="primary"
          size="lg"
          @click="isLoggedIn ? openWalletModal() : openModal('sign-in')"
        >
          <atomic-icon id="lottery"/>
          <span>{{ buttonLabel }}</span>
        </button-base>
      </div>
      
      <div class="lottery-banner__info">
        <div class="lottery-banner__info-header">
          <atomic-image  :src="infoHeaderBgImage"/>
          <div class="lottery-banner__info-header-title">
            {{ infoHeaderTitle }}
          </div>
          <div class="lottery-banner__info-header-sub-title">{{ lotteryStartAndEndDates }}</div>
        </div>
        <div class="lottery-banner__info-body">
          <div class="lottery-banner__info-body-title">{{ activeCurrencyLabel }}</div>
          <div v-if="additionalLabel" class="lottery-banner__info-body-sub-title">{{ additionalLabel }}</div>
          <div class="lottery-banner__info-divider"/>
          <lottery-timer/>
        </div>
        <div class="lottery-banner__info-footer">
          <div class="lottery-banner__info-footer-title">
            <atomic-icon id="lottery"/>
            <div class="lottery-banner__info-footer-title-text" v-html="hasTicketsLabel"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ILotteryPage } from "~/types";
  import { getContent } from "#imports";
  import DOMPurify from "isomorphic-dompurify";
  import { marked } from "marked";
  import dayjs from "dayjs";
  
  const lotteryContent = ref<Maybe<ILotteryPage>>(inject('lotteryContent'));
  const defaultLocaleLotteryContent = ref<Maybe<ILotteryPage>>(inject('defaultLocaleLotteryContent'));
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { openModal, openWalletModal } = useModalStore();
  
  const title = computed(() => getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'banner.title'));
  const subTitle = computed(() => getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'banner.subTitle'));
 
  const description = computed(() => {
    const contentText = getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'banner.description');
    if (!contentText) return '';
    return DOMPurify.sanitize(marked.parseInline(contentText) as string, { FORBID_TAGS: ['style'] });
  });
 
  const buttonLabel = computed(() => getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'banner.buttonLabel'));
  
  const backgroundGradientVars = computed(() => {
    const topColor = getContent(
      lotteryContent.value,
      defaultLocaleLotteryContent.value,
      'banner.bgGradient.topColor'
    );
    const bottomColor = getContent(
      lotteryContent.value,
      defaultLocaleLotteryContent.value,
      'banner.bgGradient.bottomColor'
    );
    if (topColor && bottomColor) return `--banner-color-top: ${topColor}; --banner-color-bottom: ${bottomColor})`;
    return null;
  });
  
  const infoHeaderTitle = computed(() => {
    const isLotteryActive = true; // todo: replace with actual logic to determine if the lottery is active
    const contentKey = isLotteryActive ? 'activeLotteryTitle' : 'plannedLotteryTitle';
    return getContent(lotteryContent.value, defaultLocaleLotteryContent.value, `banner.info.${contentKey}`) || '';
  });
  
  const infoHeaderBgImage = computed(() => getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'banner.info.headerBg'));
  
  const lotteryStartAndEndDates = computed(() => {
    // todo: replace dates from BO
    const startDate = dayjs().format('DD.MM.YYYY');
    const endDate = dayjs().format('DD.MM.YYYY');
    return `${startDate} - ${endDate}`;
  });
  
  const activeCurrencyLabel = computed(() => {
    const isNotAvailableForActiveCurrency = false; // todo: replace logic with actual
    const currentMinDepositValue = '0.00000001 mBTC'; // todo: replace with actual value
    const contentKey = isNotAvailableForActiveCurrency ? 'currencyNotAvailableLabel' : 'currencyAvailableLabel';
    const contentText = getContent(lotteryContent.value, defaultLocaleLotteryContent.value, `banner.info.${contentKey}`);
    if (!contentText) return '';
    return contentText?.replace('{minDepositAmount}', currentMinDepositValue);
  });
  
  const additionalLabel = computed(() => {
    return getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'banner.info.additionalLabel') || '';
  });
  
  const hasTicketsLabel = computed(() => {
    const contentKey = isLoggedIn.value ? 'lotteryActiveUserLabel' : 'lotteryActiveGuestLabel';
    const contentText = getContent(lotteryContent.value, defaultLocaleLotteryContent.value, `banner.info.${contentKey}`);
    if (!contentText) return '';
    return DOMPurify.sanitize(marked.parseInline(contentText) as string, { FORBID_TAGS: ['style'] });
  });
</script>

<style src="~/assets/styles/components/lottery/banner.scss" lang="scss" />