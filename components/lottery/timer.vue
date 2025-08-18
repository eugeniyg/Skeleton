<template>
  <div class="lottery-timer">
    <div v-if="props.label" class="lottery-timer__header">{{ props.label }}</div>
    
    <div class="lottery-timer__body">
      <span class="lottery-timer__item">
        <span class="lottery-timer__item-digit" :class="{ 'has-null': days === 0 }">
          {{ format(days) }}
        </span>
        <span class="lottery-timer__item-label">
          {{ daysLabel }}
        </span>
      </span>
      <span class="lottery-timer__dots">:</span>
      
      <span class="lottery-timer__item">
        <span class="lottery-timer__item-digit" :class="{ 'has-null': hours === 0 }">
          {{ format(hours) }}
        </span>
        <span class="lottery-timer__item-label">
          {{ hoursLabel }}
        </span>
      </span>
      
      <span class="lottery-timer__dots">:</span>
      <span class="lottery-timer__item">
        <span class="lottery-timer__item-digit" :class="{ 'has-null': minutes === 0 }">
          {{ format(minutes) }}
        </span>
        <span class="lottery-timer__item-label">
          {{ minutesLabel }}
        </span>
      </span>
      
      <span class="lottery-timer__dots">:</span>
      <span class="lottery-timer__item">
        <span class="lottery-timer__item-digit" :class="{ 'has-null': days === 0 && hours === 0 && minutes === 0 && seconds === 0}">
          {{ format(seconds) }}
        </span>
        <span class="lottery-timer__item-label">
          {{ secondsLabel }}
        </span>
      </span>
    
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ILotteryCommon } from "~/types";
  import { getContent } from "#imports";
  
  const props = defineProps<{
    label: string;
    date?: string;
  }>();
  
  const { days, hours, minutes, seconds, startTimer } = useTimer();
  
  const format = (value: string | number): number | string => (Number(value) < 10 ? `0${ value }` : value);
  
  const lotteryContent = ref<Maybe<ILotteryCommon>>(inject('lotteryContent'));
  const lotteryDefaultContent = ref<Maybe<ILotteryCommon>>(inject('lotteryDefaultContent'));
  
  const daysLabel = computed(() => getContent(lotteryContent.value, lotteryDefaultContent.value, 'banner.timer.daysLabel'));
  const hoursLabel = computed(() => getContent(lotteryContent.value, lotteryDefaultContent.value, 'banner.timer.hoursLabel'));
  const minutesLabel = computed(() => getContent(lotteryContent.value, lotteryDefaultContent.value, 'banner.timer.minutesLabel'));
  const secondsLabel = computed(() => getContent(lotteryContent.value, lotteryDefaultContent.value, 'banner.timer.secondsLabel'));
  
  watch(() => props.date, (newDate) => {
    if (newDate) startTimer(newDate);
  }, { immediate: true });
</script>

<style src="~/assets/styles/components/lottery/timer.scss" lang="scss"/>