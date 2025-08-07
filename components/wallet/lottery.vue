<template>
  <div class="wallet-lottery" @click="handleBonusClick">
    <form-input-lottery-radio :id="props.lotteryInfo.id" name="input-lottery-radio" :value="props.selected"/>
    
    <div class="wallet-lottery__title">Lottery #9876</div>
    
    <wallet-lottery-timer/>
    
    <div class="wallet-lottery__hints">
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
  
  const props = defineProps<{
    lotteryInfo: any; // Replace 'any' with the actual type of lotteryInfo
    selected: boolean;
    disabled: boolean;
  }>();
  
  
  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');
  
  const emit = defineEmits(['lottery-change']);
  
  const handleBonusClick = () => {
    if (props.disabled || props.selected) return;
    emit('lottery-change');
  };
</script>

<style src="~/assets/styles/components/wallet/lottery.scss" lang="scss"/>