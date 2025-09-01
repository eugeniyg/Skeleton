<template>
  <div class="wallet-lottery" @click="handleLotteryClick">
    <form-input-lottery-radio :id="props.lotteryInfo?.id" name="input-lottery-radio" :value="props.selected"/>
    
    <div class="wallet-lottery__title">{{ props.lotteryInfo?.title }}</div>
    
    <wallet-lottery-timer :date="props.lotteryInfo?.endAt || props.lotteryInfo?.startAt"/>
    
    <div class="wallet-lottery__hints">
      
      <div class="wallet-lottery__hint" v-if="activeAccountType === 'crypto'">
        <div
          class="wallet-lottery__hint-label"
          v-html="DOMPurify.sanitize(marked.parse(minAmountForCrypto || '') as string, { FORBID_TAGS: ['style'] })"
        />
      </div>
      
      <div class="wallet-lottery__hint" v-else-if="activeAccountType === 'fiat'">
        <div
          class="wallet-lottery__hint-label"
          v-html="DOMPurify.sanitize(marked.parseInline(firstLabel || '') as string, { FORBID_TAGS: ['style'] })"
        />
        
        <div v-if="depositLabel" class="wallet-lottery__hint-second-label">
          <div
            v-html="DOMPurify.sanitize(marked.parseInline(depositLabel || '') as string, { FORBID_TAGS: ['style'] })"
          />
          <atomic-picture v-if="iconImage" class="wallet-lottery__hint-icon" :src="iconImage"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IWalletModal } from "~/types";
  import { getContent } from "#imports";
  
  const walletStore = useWalletStore();
  const { activeAccount, activeAccountType } = storeToRefs(walletStore);
  import { formatBalance } from '@skeleton/helpers/amountMethods';
  import DOMPurify from "isomorphic-dompurify";
  import { marked } from "marked";
  import type { ILottery, ILotteryPrice } from "@skeleton/api/types";
  
  const props = defineProps<{
    lotteryInfo: ILottery;
    selected: boolean;
    disabled: boolean;
    amountValue?: number | string;
  }>();
  
  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');
  
  const emit = defineEmits(['lottery-change']);
  
  const handleLotteryClick = () => {
    if (props.disabled || props.selected) return;
    emit('lottery-change');
  };
  
  const amountValue = computed(() => props.amountValue ? parseFloat(props.amountValue) :  undefined);
  
  const getTicketsType = (): ILotteryPrice[] => {
    const currencies = props.lotteryInfo?.currencies;
    const activeCurrency = activeAccount.value?.currency || '';
    const ticketPrices = props.lotteryInfo?.ticketPrices || [];
    
    if (currencies !== null && !currencies?.includes(activeCurrency)) return [];
    
    const ticketPricesHasActiveCurrency = ticketPrices.filter(
      item => item.isoCode === activeCurrency
    );
    
    const ticketPricesHasEquivalentCurrency = ticketPrices.filter(
      item => item.isoCode === null
    );
    
    if (ticketPricesHasActiveCurrency.length) return ticketPricesHasActiveCurrency;
    if (currencies === null && ticketPricesHasEquivalentCurrency.length) return ticketPricesHasEquivalentCurrency;
    
    return ticketPricesHasEquivalentCurrency;
  };
  
  const getMinAmount = (): ILotteryPrice => {
    return getTicketsType()?.reduce((obj, current) =>
      current.minAmount < obj.minAmount ? current : obj
    )
  };
  
  const getMaxMinAmount = (): ILotteryPrice => {
    return getTicketsType().reduce((obj, current) =>
      current.minAmount > obj.minAmount ? current : obj
    )
  };
  
  const getTicketsLabel = computed(() => getContent(walletContent, defaultLocaleWalletContent, 'deposit.lotteries.getTicketsLabel'))
  
  const minAmountLabel = computed(() => getContent(walletContent, defaultLocaleWalletContent, 'deposit.lotteries.minAmountLabel'));
  
  const iconImage = computed(() => getContent(walletContent, defaultLocaleWalletContent, 'deposit.lotteries.image'));
  
  const isHighlightFirstLabel = computed(() => !amountValue.value || amountValue.value < getMinAmount().minAmount);
  
  const firstLabel = computed(() => {
    const result = getMinAmount();
    const { currency, amount } = formatBalance(activeAccount.value?.currency, result.minAmount);
    const amountLabel = isHighlightFirstLabel.value ? `<span class="has-accent">${ minAmountLabel.value }</span>` : minAmountLabel.value;
    
    return `${ getTicketsLabel.value } ${ amountLabel?.replace('{amount}', `${ amount } ${ currency }`) }`;
  })
  
  const depositLabel = computed(() => {
    const hasMaxMinAmount = getMaxMinAmount();
    if (amountValue.value && amountValue.value < hasMaxMinAmount.minAmount) {
      const hasMinAmount = getMinAmount();
      const label = getContent(walletContent, defaultLocaleWalletContent, 'deposit.lotteries.depositLabel');
      
      const { currency, amount } = formatBalance(activeAccount.value?.currency, hasMinAmount.minAmount);
      const ticketsCount = Math.floor(hasMinAmount.minAmount / hasMinAmount.price);
      
      return label?.replace('{amount}', `${ amount } ${ currency }`)?.replace('{ticketsCount}', `${ ticketsCount }`);
    }
    return '';
  })
  
  const minAmountForCrypto = computed(() => {
    if (!props.lotteryInfo?.ticketPrices) return '';
    
    const result = getMinAmount();
    const { currency, amount } = formatBalance(activeAccount.value?.currency, result.minAmount);
    return `${ getTicketsLabel.value } ${ minAmountLabel.value?.replace('{amount}', `${ amount } ${ currency }`) }`;
  });
</script>

<style src="~/assets/styles/components/wallet/lottery.scss" lang="scss"/>