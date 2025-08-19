<template>
  <div class="wallet-lottery" @click="handleBonusClick">
    <form-input-lottery-radio :id="props.lotteryInfo.id" name="input-lottery-radio" :value="props.selected"/>
    
    <div class="wallet-lottery__title">{{ props.lotteryInfo.title }}</div>
    
    <wallet-lottery-timer :date="props.lotteryInfo.endAt || props.lotteryInfo.startAt"/>
    
    <div class="wallet-lottery__hints">
<!--      <pre style="color:white">{{ label }}</pre>-->
<!--      -->
<!--      <pre style="color:green">{{ activeEquivalentAccount }}</pre>-->
      
      <div class="wallet-lottery__hint">
        <span class="wallet-lottery__hint-label">You will get <b>1 ticket(s)</b>,</span>
        <span class="wallet-lottery__hint-label has-accent">min amount 0.00000001 mBTC</span>
      </div>
      
      <div class="wallet-lottery__hint">
        <div class="wallet-lottery__hint-label has-deposit">Deposit 0.00000007 mBTC to get <b>3 tickets</b></div>
        <atomic-picture class="wallet-lottery__hint-icon" src="/img/uploads/wallet-lottery-icon.png"/>
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IWalletModal } from "~/types";
  import { getContent } from "#imports";
  import { getEquivalentFromBase } from "@skeleton/helpers/amountMethods";
  
  const walletStore = useWalletStore();
  const { activeAccount, activeAccountType, activeEquivalentAccount, showEquivalentBalance } = storeToRefs(walletStore);
  
  const props = defineProps<{
    lotteryInfo: any; // Replace 'any' with the actual type of lotteryInfo
    selected: boolean;
    disabled: boolean;
    amountValue?: number;
  }>();
  
  
  const { amount, currency } = getEquivalentFromBase(20, activeAccount.value?.currency);
  
  console.log('amount', amount, 'currency', currency);
  
  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');
  
  
  const activeFiatLabel = computed(() => {
    return getContent(walletContent, defaultLocaleWalletContent, 'deposit.lotteries.fiatActiveLabel') || '';
  });
  
  const activeCryptoLabel = computed(() => {
    return getContent(walletContent, defaultLocaleWalletContent, 'deposit.lotteries.cryptoActiveLabel') || '';
  });
  
  
  const label = computed(() => {
    const contentKey = activeAccountType.value === 'fiat' ? activeFiatLabel.value : activeCryptoLabel.value;
  });
  
  
  
  
  
  
  const emit = defineEmits(['lottery-change']);
  
  const handleBonusClick = () => {
    if (props.disabled || props.selected) return;
    emit('lottery-change');
  };
</script>

<style src="~/assets/styles/components/wallet/lottery.scss" lang="scss"/>