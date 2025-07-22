<template>
  <div class="referral-timer">
    <span class="referral-timer__item" :class="{ 'has-null': days === 0 }">
      {{ format(days) }}
    </span>

    <span class="referral-timer__dots">:</span>
    <span class="referral-timer__item" :class="{ 'has-null': hours === 0 }">
      {{ format(hours) }}
    </span>

    <span class="referral-timer__dots">:</span>
    <span class="referral-timer__item" :class="{ 'has-null': minutes === 0 }">
      {{ format(minutes) }}
    </span>

    <span class="referral-timer__dots">:</span>
    <span class="referral-timer__item" :class="{ 'has-null': seconds === 0 }">
      {{ format(seconds) }}
    </span>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    expiredAt: string;
  }>();

  const { days, hours, minutes, seconds, startTimer } = useTimer();

  const format = (value: string | number): number | string => (Number(value) < 10 ? `0${value}` : value);

  onMounted(() => {
    startTimer(props.expiredAt);
  });
</script>

<style src="~/assets/styles/components/referral/timer.scss" lang="scss" />
