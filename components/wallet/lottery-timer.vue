<template>
  <div class="wallet-lottery-timer">
    <div class="wallet-lottery-timer__label">{{ timerLabel }}</div>
    
    <div class="wallet-lottery-timer__body">
      <span class="wallet-lottery-timer__item" :class="{ 'has-null': days === 0 }">
          {{ format(days) }}
      </span>
      <span class="wallet-lottery-timer__dots">:</span>
      
      <span class="wallet-lottery-timer__item" :class="{ 'has-null': hours === 0 }">
          {{ format(hours) }}
      </span>
      
      <span class="wallet-lottery-timer__dots">:</span>
      <span class="wallet-lottery-timer__item" :class="{ 'has-null': minutes === 0 }">
          {{ format(minutes) }}
      </span>
      
      <span class="wallet-lottery-timer__dots">:</span>
      <span class="wallet-lottery-timer__item" :class="{ 'has-null': days === 0 && hours === 0 && minutes === 0 && seconds === 0}">
          {{ format(seconds) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IWalletModal } from "~/types";
  import { getContent } from "#imports";
  import dayjs from "dayjs";
  
  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');
  
  const { days, hours, minutes, seconds, startTimer, isAlmostDone } = useTimer();
  
  const format = (value: string | number): number | string => (Number(value) < 10 ? `0${ value }` : value);
  
  const timerLabel = computed(() => {
    return getContent(walletContent, defaultLocaleWalletContent, 'deposit.lotteries.timerFinishedLabel') || '';
  });
  
  onMounted(() => {
    const now = dayjs()
    const expiredAt = now.add(40, 'minute').format();
    
    startTimer(expiredAt);
  });
</script>

<style src="~/assets/styles/components/wallet/lottery-timer.scss" lang="scss"/>
