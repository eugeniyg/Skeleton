<template>
  <div class="lottery-ticket" :class="`is-${props.type}`">
    <div class="lottery-ticket__content">
      <div class="lottery-ticket__cell">
        <div class="lottery-ticket__title">{{ ticketLabel }}</div>
        <div class="lottery-ticket__price">{{ props?.price }}</div>
      </div>
      
      <div v-if="props.type === 'horizontal'" class="lottery-ticket__divider"/>
      
      <div class="lottery-ticket__cell">
        <div class="lottery-ticket__cell-content">
          <div class="lottery-ticket__amount">{{ props?.amount }}</div>
          <div class="lottery-ticket__amount-label">{{ depositLabel }}</div>
        </div>
        
        <div v-if="props.type === 'horizontal'" class="lottery-ticket__amount-title">40 winning tickets</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ILotteryPage } from "~/types";
  import { getContent } from "#imports";
  
  const lotteryContent = ref<Maybe<ILotteryPage>>(inject('lotteryContent'));
  const defaultLocaleLotteryContent = ref<Maybe<ILotteryPage>>(inject('defaultLocaleLotteryContent'));
  
  interface ILotteryTicketProps {
    type: 'horizontal' | 'vertical';
    amount?: string;
    price?: string;
  }
  
  const props = defineProps<ILotteryTicketProps>();
  
  const ticketLabel = computed(() => {
    return getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'ticketsTypes.ticketLabel') || '';
  });
  
  const depositLabel = computed(() => {
    return getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'ticketsTypes.depositLabel') || '';
  });
  
  
</script>

<style src="~/assets/styles/components/lottery/ticket.scss" lang="scss"/>