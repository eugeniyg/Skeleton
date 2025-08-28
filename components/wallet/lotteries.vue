<template>
  <div class="wallet-lotteries">
    <div class="wallet-lotteries__header">
      <div class="wallet-lotteries__title">
        {{ getContent(walletContent, defaultLocaleWalletContent, 'deposit.lotteries.title') }}
      </div>
      
      <form-input-toggle
        class="wallet-lotteries__decline"
        name="lottery-decline"
        :value="lotteryDeclined"
        @change="declineLotteries"
      >
        {{ getContent(walletContent, defaultLocaleWalletContent, 'deposit.lotteries.declineLabel') }}
      </form-input-toggle>
    </div>
    
    <div class="wallet-lotteries__list" v-if="!lotteryDeclined">
      <wallet-lottery
        v-for="lottery in lotteryList"
        :key="lottery.id"
        :lottery-info="lottery"
        :selected="selectedLotteryId === lottery.id"
        @lottery-change="onTicketChange(lottery)"
        :disabled="false"
        :amount-value="props.amount ? parseFloat(props.amount) : undefined"
      />
    </div>
    
  </div>
</template>

<script setup lang="ts">
  import type { IWalletModal } from "~/types";
  import { getContent } from "#imports";
  import { getLotteriesPricing } from '@skeleton/api/retention';
  import { useLotteryStore } from "@skeleton/stores/useLotteryStore";
  
  const lotteryStore = useLotteryStore();
  const { lotteryDeclined, selectedLotteryId } = storeToRefs(lotteryStore);
  
  const props = defineProps<{
    amount?: number;
  }>();
  
  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');
  
  const { openModal } = useModalStore();
  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);
  
  const onTicketChange = (lottery: any) => {
    selectedLotteryId.value = lottery.id;
  };
  
  const declineLotteries = () => {
    if (!lotteryDeclined.value) {
      openModal('cancel-lottery', { props: { lotteryDeclined: false } });
      return;
    }
    lotteryDeclined.value = !lotteryDeclined.value;
  };
  
  const lotteryList = ref<any[]>([]);
  
  const getLotteryData = async () => {
    try {
      const lotteryData = await getLotteriesPricing(activeAccount.value?.currency);
      lotteryList.value = lotteryData;
      selectedLotteryId.value = lotteryData[0]?.id;
    } catch (error) {
      console.error('Error fetching lottery data:', error);
    }
  }
  
  watch(() => props.amount, () => {
    getLotteryData();
  }, { immediate: true });
  
</script>

<style src="~/assets/styles/components/wallet/lotteries.scss" lang="scss" />