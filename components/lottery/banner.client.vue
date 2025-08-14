<template>
  <div class="lottery-banner">
    <div class="lottery-banner__container" :style="backgroundGradientVars">
      <div class="lottery-banner__content">
        <div class="lottery-banner__title">{{ lotteryTitle }}</div>
        <div v-if="lotterySubTitle" class="lottery-banner__sub-title">{{ lotterySubTitle }}</div>
        <div v-if="lotteryDescription" class="lottery-banner__description" v-html="lotteryDescription"/>
        
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
          <atomic-image :src="infoHeaderBgImage"/>
          <div class="lottery-banner__info-header-title">{{ infoTitle }}</div>
          <div class="lottery-banner__info-header-sub-title">{{ lotteryPeriod }}</div>
        </div>
        
        <div class="lottery-banner__info-body">
          <div class="lottery-banner__info-body-title">
            <span class="lottery-banner__custom-link" v-if="!isLoggedIn" @click="openModal('sign-in');">{{ loginRequiredLabel }}</span>
            <span v-else>{{ minDepositForActiveCurrency }}</span>
          </div>
          <div v-if="additionalLabel" class="lottery-banner__info-body-sub-title">{{ additionalLabel }}</div>
          <div class="lottery-banner__info-divider"/>
          <lottery-timer :date="timerDate" :label="timerLabel"/>
        </div>
        
        <div class="lottery-banner__info-footer">
          <div class="lottery-banner__info-footer-title" v-if="!isLoggedIn">
              {{ getContent(lotteryContent, lotteryDefaultContent, 'banner.info.guestTicketsCountLabel') }}
          </div>
          <div class="lottery-banner__info-footer-title" v-else>
            <atomic-icon id="lottery"/>
            <div class="lottery-banner__info-footer-title-text" v-html="ticketsCountLabel"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ILotteryPage, ILotteryCommon } from "~/types";
  import type { ILottery, ILotteryTicketPrice } from "@skeleton/api/types";
  import DOMPurify from "isomorphic-dompurify";
  import dayjs from "dayjs";
  import { getContent } from "#imports";
  import { marked } from "marked";
  import { formatBalance } from "@skeleton/helpers/amountMethods";
  
  const props = defineProps<{
    lotteryData?: ILottery;
  }>();
  
  const lotteryPageContent = ref<Maybe<ILotteryPage>>(inject('lotteryPageContent'));
  const lotteryPageDefaultContent = ref<Maybe<ILotteryPage>>(inject('lotteryPageDefaultContent'));
  const lotteryContent = ref<Maybe<ILotteryCommon>>(inject('lotteryContent'));
  const lotteryDefaultContent = ref<Maybe<ILotteryCommon>>(inject('lotteryDefaultContent'));
  
  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);
  
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { openModal, openWalletModal } = useModalStore();
  
  const backgroundGradientVars = computed(() => {
    const topColor = getContent(
      lotteryContent.value,
      lotteryDefaultContent.value,
      'banner.bgGradient.topColor'
    );
    const bottomColor = getContent(
      lotteryContent.value,
      lotteryDefaultContent.value,
      'banner.bgGradient.bottomColor'
    );
    if (topColor && bottomColor) return `--banner-color-top: ${ topColor }; --banner-color-bottom: ${ bottomColor })`;
    return null;
  });
  
  const lotteryTitle = computed(() => getContent(lotteryPageContent.value, lotteryPageDefaultContent.value, 'title'));
  const lotterySubTitle = computed(() => getContent(lotteryPageContent.value, lotteryPageDefaultContent.value, 'banner.subTitle'));
  const lotteryDescription = computed(() => {
    const contentText = getContent(lotteryPageContent.value, lotteryPageDefaultContent.value, 'banner.description');
    if (!contentText) return '';
    return DOMPurify.sanitize(marked.parseInline(contentText) as string, { FORBID_TAGS: ['style'] });
  });
  
  const buttonLabel = computed(() => getContent(lotteryContent.value, lotteryDefaultContent.value, 'banner.buttonLabel') || '');
  const infoHeaderBgImage = computed(() => getContent(lotteryContent.value, lotteryDefaultContent.value, 'banner.info.headerBg'));
  const infoTitle = computed(() => {
    if (props.lotteryData?.state === 2) {
      return getContent(lotteryContent.value, lotteryDefaultContent.value, 'banner.info.plannedLotteryTitle') || '';
    } else {
      return getContent(lotteryPageContent.value, lotteryPageDefaultContent.value, 'banner.info.title') || ''
    }
  });
  
  const lotteryPeriod = computed(() => {
    const startDate = dayjs(props.lotteryData?.startAt)?.format('DD.MM.YYYY');
    const endDate = dayjs(props.lotteryData?.endAt)?.format('DD.MM.YYYY');
    return `${ startDate } - ${ endDate }`;
  });
  
  const findMinimalDeposit = (item: ILotteryTicketPrice[]): ILotteryTicketPrice => {
    return item?.reduce((obj, current) =>
      current.minAmount < obj.minAmount ? current : obj
    )
  };
  
  const loginRequiredLabel = computed(() => {
    const contentText = getContent(lotteryContent.value, lotteryDefaultContent.value, 'banner.info.loginRequiredLabel');
    return DOMPurify.sanitize(marked.parseInline(contentText || '') as string, { FORBID_TAGS: ['style'] });
  });
  
  const minDepositForActiveCurrency = computed(() => {
    const ticketPricesHasActiveCurrency = props.lotteryData?.ticketPrices?.filter(
      item => item.isoCode === activeAccount.value?.currency
    ) || [];
    
    const ticketPricesHasBaseCurrency = props.lotteryData?.ticketPrices?.filter(
      item => item.isoCode === null
    ) || [];
    
    if (ticketPricesHasActiveCurrency.length || ticketPricesHasBaseCurrency.length) {
      let textContent = getContent(lotteryContent.value, lotteryDefaultContent.value, 'banner.info.depositAmountLabel') || '';
      let depositAmount = '';
      
      if (!ticketPricesHasActiveCurrency.length && ticketPricesHasBaseCurrency.length) {
        const { minAmount } = findMinimalDeposit(ticketPricesHasBaseCurrency);
        const { amount, currency } = formatBalance(activeAccount.value?.currency, minAmount);
        depositAmount = `${amount} ${currency}`;
      } else if (ticketPricesHasActiveCurrency.length) {
        const { minAmount, isoCode } = findMinimalDeposit(ticketPricesHasActiveCurrency);
        const { amount, currency } = formatBalance(isoCode, minAmount);
        depositAmount = `${amount} ${currency}`;
      }
      return textContent.replace('{amount}', depositAmount);
    }
    return getContent(lotteryContent.value, lotteryDefaultContent.value, 'banner.info.notAvailableCurrencyLabel') || '';
  });
  
  const timerDate = computed(() => {
    return props.lotteryData?.state === 2 ? props.lotteryData?.startAt : props.lotteryData?.endAt;
  });
  
  const timerLabel = computed(() => {
    const contentKey = props.lotteryData?.state === 2
      ? 'plannedTitle'
      : 'activeTitle';
      return getContent(lotteryContent.value, lotteryDefaultContent.value, `banner.timer.${contentKey}`) || ''
  });
  
  const additionalLabel = computed(() => {
    return getContent(lotteryContent.value, lotteryDefaultContent.value, 'banner.info.additionalLabel') || '';
  });
  
  const ticketsCountLabel = computed(() => {
    let contentText = '';
    if (props.lotteryData?.minPlayerTickets !== undefined && props.lotteryData?.maxPlayerTickets !== undefined) {
      contentText = getContent(lotteryContent.value, lotteryDefaultContent.value, 'banner.info.ticketsCountLabel')
        ?.replace('{ticketsCount}', String(props.lotteryData.minPlayerTickets))
        ?.replace('{totalTicketsCount}', String(props.lotteryData.maxPlayerTickets));
    }
    return DOMPurify.sanitize(marked.parseInline(contentText || '') as string, { FORBID_TAGS: ['style'] });
  });
</script>

<style src="~/assets/styles/components/lottery/banner.scss" lang="scss"/>