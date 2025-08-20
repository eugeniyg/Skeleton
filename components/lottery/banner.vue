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
          <client-only>
            <div class="lottery-banner__info-body-title">
              <div v-if="!isLoggedIn" class="lottery-banner__custom-link" @click="openModal('sign-in');">
                {{ loginRequiredLabel }}
              </div>
              <div v-else>{{ minDepositForActiveCurrency }}</div>
            </div>
          </client-only>
          
          <div v-if="additionalLabel" class="lottery-banner__info-body-sub-title">{{ additionalLabel }}</div>
          <div class="lottery-banner__info-divider"/>
          <lottery-timer :date="timerDate" :label="timerLabel"/>
        </div>
        
        <div class="lottery-banner__info-footer">
          <client-only>
            <div class="lottery-banner__info-footer-title" v-if="!isLoggedIn">
              {{ getContent(lotteryContent, lotteryDefaultContent, 'banner.info.guestTicketsCountLabel') }}
            </div>
            <div class="lottery-banner__info-footer-title" v-else>
              <atomic-icon id="lottery"/>
              <div class="lottery-banner__info-footer-title-text" v-html="ticketsCountLabel"/>
            </div>
          </client-only>
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
  
  const lotteryTitle = computed(() => getContent(lotteryPageContent.value, lotteryPageDefaultContent.value, 'banner.title'));
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
  
  const depositAmountLabel = computed(() => {
    return getContent(lotteryContent.value, lotteryDefaultContent.value, 'banner.info.depositAmountLabel') || '';
  });
  
  const getMinDepositForActiveCurrency = () => {
    const currencies = props.lotteryData?.currencies;
    const activeCurrency = activeAccount.value?.currency || '';
    
    if (currencies !== null && !currencies?.includes(activeCurrency)) {
      return getContent(lotteryContent.value, lotteryDefaultContent.value, 'banner.info.notAvailableCurrencyLabel') || '';
    }
    
    const ticketPrices = props.lotteryData?.ticketPrices || [];
    
    const ticketPricesHasActiveCurrency = ticketPrices.filter(
      item => item.isoCode === activeCurrency
    ) || [];
    
    const ticketPricesHasEquivalentCurrency = ticketPrices.filter(
      item => item.isoCode === null
    ) || [];
    
    let minAmount: number;
    
    if (ticketPricesHasActiveCurrency.length) {
      minAmount = findMinimalDeposit(ticketPricesHasActiveCurrency).minAmount;
    } else if (currencies === null) {
      minAmount = findMinimalDeposit(ticketPrices).minAmount;
    } else {
      minAmount = findMinimalDeposit(ticketPricesHasEquivalentCurrency).minAmount;
    }
    
    const { amount, currency } = formatBalance(activeCurrency, minAmount);
    const depositAmount = `${ amount } ${ currency }`;
    return depositAmountLabel.value?.replace('{amount}', depositAmount);
  };
  
  const minDepositForActiveCurrency = ref();
  
  watch(() => props.lotteryData, (newValue) => {
    if (newValue) {
      minDepositForActiveCurrency.value = getMinDepositForActiveCurrency();
    }
  }, { immediate: true });
  
  const timerDate = computed(() => {
    return props.lotteryData?.state === 2 ? props.lotteryData?.startAt : props.lotteryData?.endAt;
  });
  
  const timerLabel = computed(() => {
    const contentKey = props.lotteryData?.state === 2
      ? 'plannedTitle'
      : 'activeTitle';
    return getContent(lotteryContent.value, lotteryDefaultContent.value, `banner.timer.${ contentKey }`) || ''
  });
  
  const additionalLabel = computed(() => {
    return getContent(lotteryPageContent.value, lotteryPageDefaultContent.value, 'banner.info.additionalLabel') || '';
  });
  
  const ticketsCountLabel = computed(() => {
    let contentText = '';
    
    if (props.lotteryData?.maxPlayerTickets !== null && props.lotteryData?.maxPlayerTickets !== undefined) {
      contentText = getContent(lotteryContent.value, lotteryDefaultContent.value, 'banner.info.ticketsCountWithTotal')
        ?.replace('{ticketsCount}', String(props.lotteryData.ticketsCount))
        ?.replace('{totalTicketsCount}', String(props.lotteryData.maxPlayerTickets)
      );
    } else {
      contentText = getContent(lotteryContent.value, lotteryDefaultContent.value, 'banner.info.ticketsCountWithoutTotal')
        ?.replace('{ticketsCount}', String(props.lotteryData?.ticketsCount || 0));
    }
    
    return DOMPurify.sanitize(marked.parseInline(contentText || '') as string, { FORBID_TAGS: ['style'] });
  });
</script>

<style src="~/assets/styles/components/lottery/banner.scss" lang="scss"/>