<template>
  <div class="lottery-tickets-types">
    <div class="lottery-tickets-types__title">{{ title }}</div>
    <div v-if="description" class="lottery-tickets-types__description" v-html="description"/>
    
    <div v-if="tickets?.length" class="lottery-tickets-types__tickets">
      <lottery-ticket
        v-for="(ticket, index) in tickets" :key="index"
        v-bind="ticket"
        :type="index < 3 ? 'vertical' : 'horizontal'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ILotteryPage } from "~/types";
  import type { ILottery, ILotteryTicketPrice } from "@skeleton/api/types";
  import DOMPurify from "isomorphic-dompurify";
  import { getContent } from "#imports";
  import { marked } from "marked";
  import { formatBalance } from '@skeleton/helpers/amountMethods';
  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);
  
  const props = defineProps<{
    lotteryData?: ILottery;
  }>();
  
  const lotteryPageContent = ref<Maybe<ILotteryPage>>(inject('lotteryPageContent'));
  const lotteryPageDefaultContent = ref<Maybe<ILotteryPage>>(inject('lotteryPageDefaultContent'));
  const tickets = ref();
  
  const title = computed(() => getContent(lotteryPageContent.value, lotteryPageDefaultContent.value, 'ticketsTypes.title') || '');
  
  const description = computed(() => {
    const contentText = getContent(lotteryPageContent.value, lotteryPageDefaultContent.value, 'ticketsTypes.description');
    return DOMPurify.sanitize(marked.parseInline(contentText || '') as string, { FORBID_TAGS: ['style'] });
  });
  
  const getTickets = () => {
    const activeCurrency = activeAccount.value?.currency || '';
    const ticketPrices = props.lotteryData?.ticketPrices || [];
    const currencies = props.lotteryData?.currencies;
    
    const ticketPricesHasActiveCurrency = ticketPrices.filter(
      item => item.isoCode === activeCurrency
    ) || [];
    
    const ticketPricesHasEquivalentCurrency = ticketPrices.filter(
      item => item.isoCode === null
    ) || [];
    
    let resultPrices: ILotteryTicketPrice[];
    
    if (ticketPricesHasActiveCurrency.length) {
      resultPrices = ticketPricesHasActiveCurrency;
    } else if (currencies === null && ticketPricesHasEquivalentCurrency.length) {
      resultPrices = ticketPricesHasEquivalentCurrency;
    } else {
      resultPrices = ticketPrices;
    }
    
    return resultPrices?.map(item => {
      const currencyCode = item.isoCode || activeCurrency;
      const minAmountBalance = formatBalance(currencyCode, item.minAmount);

      return {
        currency: minAmountBalance.currency,
        minAmount: minAmountBalance.amount,
        price: formatBalance(currencyCode, item.price).amount,
      };
    })?.sort((a, b) => parseFloat(b.minAmount) - parseFloat(a.minAmount))
  };
  
  watch(() => props.lotteryData, (newValue) => {
    if (newValue) {
      tickets.value = getTickets();
    }
  }, { immediate: true })
</script>

<style src="~/assets/styles/components/lottery/tickets-types.scss" lang="scss"/>
