<template>
  <div class="lottery-ticket" :class="`is-${props.type}`">
    <div class="lottery-ticket__content">
      <div class="lottery-ticket__cell">
        <div class="lottery-ticket__title">{{ ticketLabel }}</div>
        <div class="lottery-ticket__price">{{ props.price }} {{ props.currency }}</div>
      </div>
      
      <div v-if="props.type === 'horizontal'" class="lottery-ticket__divider"/>
      
      <div class="lottery-ticket__cell">
        <div class="lottery-ticket__cell-content">
          <div class="lottery-ticket__amount">{{ props.minAmount }} {{ props.currency }}</div>
          <div class="lottery-ticket__amount-label">{{ depositLabel }}</div>
        </div>
        
        <div v-if="props.type === 'horizontal' && additionalLabel" class="lottery-ticket__amount-title">
          {{ additionalLabel }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ILotteryCommon } from "~/types";
  import { getContent } from "#imports";
  
  const lotteryContent = ref<Maybe<ILotteryCommon>>(inject('lotteryContent'));
  const lotteryDefaultContent = ref<Maybe<ILotteryCommon>>(inject('lotteryDefaultContent'));
  
  const props = defineProps<{
    type: 'horizontal' | 'vertical';
    minAmount: number;
    price: number;
    currency: string;
  }>();
  
  const ticketLabel = computed(() => {
    return getContent(lotteryContent.value, lotteryDefaultContent.value, 'ticketsTypes.ticketLabel') || '';
  });
  
  const depositLabel = computed(() => {
    return getContent(lotteryContent.value, lotteryDefaultContent.value, 'ticketsTypes.depositLabel') || '';
  });
  
  const additionalLabel = computed(() => {
    return getContent(lotteryContent.value, lotteryDefaultContent.value, 'ticketsTypes.additionalLabel') || '';
  });
</script>

<style src="~/assets/styles/components/lottery/ticket.scss" lang="scss"/>