<template>
  <div class="lottery-timer">
    <div class="lottery-timer__header">{{ activeLotteryTitle || plannedLotteryTitle }}</div>
    
    <div class="lottery-timer__body" v-if="!isAlmostDone">
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
  import type { ILotteryPage } from "~/types";
  import { getContent } from "#imports";
  import dayjs from "dayjs";
  
  const { days, hours, minutes, seconds, startTimer, isAlmostDone } = useTimer();
  
  const format = (value: string | number): number | string => (Number(value) < 10 ? `0${ value }` : value);
  
  const lotteryContent = ref<Maybe<ILotteryPage>>(inject('lotteryContent'));
  const defaultLocaleLotteryContent = ref<Maybe<ILotteryPage>>(inject('defaultLocaleLotteryContent'));
  
  const activeLotteryTitle = computed(() => getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'banner.timer.activeTitle'));
  const plannedLotteryTitle = computed(() => getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'banner.timer.plannedTitle'));
  const daysLabel = computed(() => getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'banner.timer.daysLabel'));
  const hoursLabel = computed(() => getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'banner.timer.hoursLabel'));
  const minutesLabel = computed(() => getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'banner.timer.minutesLabel'));
  const secondsLabel = computed(() => getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'banner.timer.secondsLabel'));
  
  onMounted(() => {
    const now = dayjs()
    const expiredAt = now.add(40, 'minute').format();
    
    startTimer(expiredAt);
  });
</script>

<style src="~/assets/styles/components/lottery/timer.scss" lang="scss"/>