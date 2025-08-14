<template>
  <div class="lottery-tickets-types">
    <div class="lottery-tickets-types__title">{{ title }}</div>
    <div v-if="description" class="lottery-tickets-types__description" v-html="description"/>
    
    <div v-if="tickets?.length" class="lottery-tickets-types__tickets">
      <template v-for="(ticket, index) in tickets" :key="index">
        <lottery-ticket
          v-bind="ticket"
          :type="index <= 2 ? 'vertical' : 'horizontal'"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ILotteryPage } from "~/types";
  import type { ILotteryTicketPrice } from "@skeleton/api/types";
  import DOMPurify from "isomorphic-dompurify";
  import { getContent } from "#imports";
  import { marked } from "marked";
  import { formatBalance } from '@skeleton/helpers/amountMethods';
  
  const props = defineProps<{
    items: ILotteryTicketPrice[];
  }>();
  
  const lotteryPageContent = ref<Maybe<ILotteryPage>>(inject('lotteryPageContent'));
  const lotteryPageDefaultContent = ref<Maybe<ILotteryPage>>(inject('lotteryPageDefaultContent'));
  
  const globalStore = useGlobalStore();
  const { baseCurrency } = storeToRefs(globalStore);
  
  const title = computed(() => getContent(lotteryPageContent.value, lotteryPageDefaultContent.value, 'ticketsTypes.title') || '');
  
  const description = computed(() => {
    const contentText = getContent(lotteryPageContent.value, lotteryPageDefaultContent.value, 'ticketsTypes.description');
    return DOMPurify.sanitize(marked.parseInline(contentText || '') as string, { FORBID_TAGS: ['style'] });
  });
  
  const tickets = computed(() => {
    return props.items.map(item => {
      const currencyCode = item.isoCode || baseCurrency.value?.code;
      const minAmountBalance = formatBalance(currencyCode, item.minAmount);
      
      return {
        currency: minAmountBalance.currency,
        minAmount: minAmountBalance.amount,
        price: formatBalance(currencyCode, item.price).amount,
      };
    })?.sort((a, b) => parseFloat(b.minAmount) - parseFloat(a.minAmount))
  });
</script>

<style src="~/assets/styles/components/lottery/tickets-types.scss" lang="scss"/>
