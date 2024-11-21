<template>
  <div class="tournament-card-active">
    <div class="tournament-card-active__container">
      <div class="tournament-card-active__header">
        <div class="tournament-card-active__timer">
          <div class="tournament-card-active__timer-header is-finished"> <!-- is-started -->
            Finished in <!-- Starting in -->
          </div>
          <div class="tournament-card-active__timer-countdown">
            <span class="time-span time-span-days">{{ format(days) }}</span>
            <span class="time-span-dots">:</span>
            <span class="time-span">{{ format(hours) }}</span>
            <span class="time-span-dots">:</span>
            <span class="time-span">{{ format(minutes) }}</span>
            <span class="time-span-dots">:</span>
            <span class="time-span">{{ format(seconds) }}</span>
          </div>
        </div>
      </div>
      
      <div class="tournament-card-active__content">
        <div class="tournament-card-active__title">{{ props.title }}</div>
        <div class="tournament-card-active__sub-title">{{ props.subTitle }}</div>
      </div>
      
      <atomic-image class="tournament-card-active__img" :src="props.image"/>
      
      <div class="tournament-card-active__actions">
        <button-base type="primary" size="md">Take part</button-base>
        <button-base type="ghost" size="md">More info</button-base>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    title: string;
    subTitle: string;
    image: string;
    startedAt: string;
    expiredAt: string;
  }>();
  
  const {
    isAlmostDone,
    days,
    hours,
    minutes,
    seconds,
    startTimer
  } = useTimer();
  
  const format = (value: string | number): number | string => (Number(value) < 10 ? `0${value}` : value);
  
  onMounted(() => {
    if (props.expiredAt) {
      startTimer(props.expiredAt);
    }
  });
</script>

<style src="~/assets/styles/components/tournament/card-active.scss" lang="scss"/>

