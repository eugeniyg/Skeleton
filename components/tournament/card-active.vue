<template>
  <div class="tournament-card-active">
    <div class="tournament-card-active__header">
      <div>
        <span v-if="days" class="time-span">{{ format(days) }}d</span>
        <span class="time-span">{{ format(hours) }}h</span>
        <span class="time-span">{{ format(minutes) }}m</span>
        <span class="time-span">{{ format(seconds) }}s</span>
      </div>
    </div>
    
    <div class="tournament-card-active__content">
      <div class="tournament-card-active__title">Free-to-play Slotsbet Battle Slotsbet Battle Free</div>
      <div class="tournament-card-active__sub-title">$24,000,000</div>
    </div>
    
    <atomic-image
      src="/img/uploads/tournament/card/2.png"
      class="tournament-card-active__img"
    />
    
    <div class="tournament-card-active__actions">
      <button-base type="primary" size="md">Take part</button-base>
      <button-base type="ghost" size="md">More info</button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    expiredAt: string;
  }>()
  const { isAlmostDone, days, hours, minutes, seconds, startTimer } = useTimer();
  
  const dayjs = useDayjs();
  const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
  const format = (value: string | number): number | string => (Number(value) < 10 ? `0${value}` : value);
  
  onMounted(() => {
    if (props.expiredAt) {
      startTimer(props.expiredAt);
    }
  });
</script>

<style src="~/assets/styles/components/tournament/card-active.scss" lang="scss" />

