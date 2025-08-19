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
        @click="showConfirm"
      >
        {{ getContent(walletContent, defaultLocaleWalletContent, 'deposit.lotteries.declineLabel') }}
      </form-input-toggle>
    </div>
    
    <div class="wallet-lotteries__list" v-if="!lotteryDeclined">
      <wallet-lottery
        v-for="(lottery, index) in tickets" :key="lottery.id"
        :lottery-info="lottery"
        :selected="checkSelected(lottery, index === 0)"
        @lottery-change="onTicketChange(lottery)"
        :disabled="false"
      />
    </div>
    
  </div>
</template>

<script setup lang="ts">
  import type { IWalletModal } from "~/types";
  import { getContent } from "#imports";
  import { getLotteriesPricing } from '@skeleton/api/retention';
  
  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');
  
  const { openModal } = useModalStore();
  const walletStore = useWalletStore();
  const { activeAccountType, activeAccount } = storeToRefs(walletStore);
  
  const lotteriesList = [
    {
      id: "1"
    },
    {
      id: "2"
    },
  ];
  
  const lotteryDeclined = ref(false);
  
  const checkSelected = (ticket: any, selectFirst: boolean) => {
    return selectFirst;
  };
  
  const onTicketChange = (lottery: any) => {
    // Logic to handle ticket change
    console.log('Ticket changed:', lottery);
  };
  
  const declineLotteries = () => {
    //lotteryDeclined.value = !lotteryDeclined.value;
  };
  
  const showConfirm = () => {
    if (!lotteryDeclined.value) {
      openModal('cancel-lottery');
    }
  }
  
  
  const tickets = ref([]);
  
  
  
  onMounted(async () => {
    const ticketsData = await getLotteriesPricing(activeAccount.value?.currency);
    tickets.value = ticketsData;
    console.log('Tickets fetched:', tickets);
  })
  
</script>

<style src="~/assets/styles/components/wallet/lotteries.scss" lang="scss" />