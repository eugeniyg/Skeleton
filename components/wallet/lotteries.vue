<template>
  <div class="wallet-lotteries">
    <div class="wallet-lotteries__header">
      <div class="wallet-lotteries__title">
        {{ getContent(walletContent, defaultLocaleWalletContent, 'deposit.lotteries.title') }}
      </div>
      
      <form-input-toggle
        class="wallet-lotteries__decline"
        name="lottery-decline"
        :value="isLotteryDeclined"
        @change="declineLotteries"
        :loading="isLotteryUpdating"
      >
        {{ getContent(walletContent, defaultLocaleWalletContent, 'deposit.lotteries.declineLabel') }}
      </form-input-toggle>
    </div>
    
    <div class="wallet-lotteries__list" v-if="!isLotteryDeclined && lotteryList.length > 0">
      <wallet-lottery
        v-for="lottery in lotteryList"
        :key="lottery.id"
        :lottery-info="lottery"
        :selected="selectedLotteryId === lottery.id"
        :disabled="activeAccountType === 'fiat' ? !hasAvailableIds.includes(lottery.id) : false"
        :amount-value="props.amount"
        @lottery-change="onTicketChange(lottery)"
        @lottery-ended="getLotteryData"
      />
    </div>
  
  </div>
</template>

<script setup lang="ts">
  import type { IWalletModal } from "~/types";
  import { getContent } from "#imports";
  import { getLotteriesPricing } from '@skeleton/api/retention';
  import { useLotteryStore } from "@skeleton/stores/useLotteryStore";
  import { changeProfileData } from '@skeleton/api/profile';
  import type { ILottery } from "@skeleton/api/types";
  
  const profileStore = useProfileStore();
  const { profile } = storeToRefs(profileStore);
  
  const lotteryStore = useLotteryStore();
  const { selectedLotteryId, isLotteryUpdating } = storeToRefs(lotteryStore);
  const { setProfileData } = useProfileStore()
  
  const props = defineProps<{
    amount?: number | string;
  }>();
  
  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');
  
  const { openModal } = useModalStore();
  const walletStore = useWalletStore();
  const { activeAccount, activeAccountType } = storeToRefs(walletStore);
  
  const lotteryList = ref<ILottery[]>([]);
  
  const isLotteryDeclined = computed(() => {
    return !profile.value?.inLottery;
  });
  
  const onTicketChange = (lottery: ILottery) => {
    selectedLotteryId.value = lottery.id;
  };
  
  const declineLotteries = async () => {
    if (!isLotteryDeclined.value) {
      await openModal('cancel-lottery');
      return;
    }
    try {
      isLotteryUpdating.value = true;
      const submitResult = await changeProfileData({ inLottery: true });
      setProfileData(submitResult);
      isLotteryUpdating.value = false;
      await getLotteryData();
    } catch (error) {
      console.error('Error updating lottery status:', error);
      return;
    }
  };
  
  const getLotteryData = async () => {
    try {
      const lotteryData = await getLotteriesPricing(activeAccount.value?.currency);
      lotteryList.value = lotteryData || [];
      getAvailableLotteryIds();
    } catch (error) {
      console.error('Error fetching lottery data:', error);
    }
  }
  
  const hasAvailableIds = ref<string[]>([]);
  
  const getAvailableLotteryIds = () => {
    if (!props.amount && lotteryList.value.length > 0) {
      hasAvailableIds.value = [];
      return;
    }
    
    if (activeAccountType.value === 'fiat') {
      hasAvailableIds.value = lotteryList.value.filter(lottery => {
        const currencyTickets = lottery.ticketPrices.filter(
          ticket => ticket.isoCode === activeAccount.value?.currency
        );
        
        if (currencyTickets.length > 0) {
          return currencyTickets.some(ticket => props.amount >= ticket.minAmount);
        }
        
        return lottery.ticketPrices.some(
          ticket => ticket.isoCode === null && props.amount >= ticket.minAmount
        );
      }).map(item => item.id);
      
    } else if (activeAccountType.value === 'crypto') {
      hasAvailableIds.value = lotteryList.value.filter(lottery => {
        const currencyTickets = lottery.ticketPrices.filter(
          ticket => ticket.isoCode === activeAccount.value?.currency
        );
        
        if (currencyTickets.length > 0) {
          return currencyTickets;
        }
        
        return lottery.ticketPrices.some(
          ticket => ticket.isoCode === null
        );
      }).map(item => item.id);
    }
    
    selectedLotteryId.value = hasAvailableIds.value[0];
  }
  
  watch(() => activeAccount.value?.currency, () => {
    getLotteryData();
  }, { immediate: true });
  
  watch(() => props.amount, () => {
    getAvailableLotteryIds();
  }, { immediate: true });
</script>

<style src="~/assets/styles/components/wallet/lotteries.scss" lang="scss"/>