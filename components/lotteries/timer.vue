<template>
  <div class="lotteries-timer">
    <div class="lotteries-timer__header">{{ title }}</div>
    
    <div class="lotteries-timer__body" v-if="!isAlmostDone">
      <span class="lotteries-timer__item">
        <span class="lotteries-timer__item-digit" :class="{ 'has-null': days === 0 }">
          {{ format(days) }}
        </span>
        <span class="lotteries-timer__item-label">
          {{ daysLabel }}
        </span>
      </span>
      <span class="lotteries-timer__dots">:</span>
      
      <span class="lotteries-timer__item">
        <span class="lotteries-timer__item-digit" :class="{ 'has-null': hours === 0 }">
          {{ format(hours) }}
        </span>
        <span class="lotteries-timer__item-label">
          {{ hoursLabel }}
        </span>
      </span>
      
      <span class="lotteries-timer__dots">:</span>
      <span class="lotteries-timer__item">
        <span class="lotteries-timer__item-digit" :class="{ 'has-null': minutes === 0 }">
          {{ format(minutes) }}
        </span>
        <span class="lotteries-timer__item-label">
          {{ minutesLabel }}
        </span>
      </span>
      
      <span class="lotteries-timer__dots">:</span>
      <span class="lotteries-timer__item">
        <span class="lotteries-timer__item-digit" :class="{ 'has-null': days === 0 && hours === 0 && minutes === 0 && seconds === 0}">
          {{ format(seconds) }}
        </span>
        <span class="lotteries-timer__item-label">
          {{ secondsLabel }}
        </span>
      </span>
    
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ILotteriesPage } from "~/types";
  import { getContent } from "#imports";
  import dayjs from "dayjs";
  
  const { days, hours, minutes, seconds, startTimer, isAlmostDone } = useTimer();
  
  const format = (value: string | number): number | string => (Number(value) < 10 ? `0${ value }` : value);
  
  const lotteriesContent = ref<Maybe<ILotteriesPage>>(inject('lotteriesContent'));
  const defaultLocaleLotteriesContent = ref<Maybe<ILotteriesPage>>(inject('defaultLocaleLotteriesContent'));
  
  const title = computed(() => getContent(lotteriesContent.value, defaultLocaleLotteriesContent.value, 'banner.timer.title'));
  const daysLabel = computed(() => getContent(lotteriesContent.value, defaultLocaleLotteriesContent.value, 'banner.timer.daysLabel'));
  const hoursLabel = computed(() => getContent(lotteriesContent.value, defaultLocaleLotteriesContent.value, 'banner.timer.hoursLabel'));
  const minutesLabel = computed(() => getContent(lotteriesContent.value, defaultLocaleLotteriesContent.value, 'banner.timer.minutesLabel'));
  const secondsLabel = computed(() => getContent(lotteriesContent.value, defaultLocaleLotteriesContent.value, 'banner.timer.secondsLabel'));
  
  onMounted(() => {
    const now = dayjs()
    const expiredAt = now.add(40, 'minute').format();
    
    startTimer(expiredAt);
  });
</script>

<style src="~/assets/styles/components/lotteries/timer.scss" lang="scss"/>