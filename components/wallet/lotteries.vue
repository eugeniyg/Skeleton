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
        :disabled="false"
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
  const { activeAccount } = storeToRefs(walletStore);
  
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
    } catch (error) {
      console.error('Error updating lottery status:', error);
      return;
    }
  };
  
  const getLotteryData = async () => {
    try {
      const lotteryData = await getLotteriesPricing(activeAccount.value?.currency);
      lotteryList.value = lotteryData || [];
      selectedLotteryId.value = !selectedLotteryId.value ? lotteryData[0]?.id : selectedLotteryId.value;
    } catch (error) {
      console.error('Error fetching lottery data:', error);
    }
  }
  
  watch(() => activeAccount.value?.currency, () => {
    getLotteryData();
  }, { immediate: true });
</script>

<style src="~/assets/styles/components/wallet/lotteries.scss" lang="scss" />