<template>
  <div class="bonuses-timer">
    <span class="bonuses-timer__item" :class="{'has-null': state.days === 0}">
      <span class="bonuses-timer__item-digit">{{ format(state.days)  }}</span>
      <span class="bonuses-timer__item-label">{{ timerContent?.days }}</span>
    </span>

    <span class="bonuses-timer__dots">:</span>

    <span class="bonuses-timer__item" :class="{'has-null': state.hours === 0}">
      <span class="bonuses-timer__item-digit">{{ format(state.hours) }}</span>
      <span class="bonuses-timer__item-label">{{ timerContent?.hours }}</span>
    </span>

    <span class="bonuses-timer__dots">:</span>

    <span class="bonuses-timer__item" :class="{'has-null': state.minutes === 0}">
      <span class="bonuses-timer__item-digit">{{ format(state.minutes) }}</span>
      <span class="bonuses-timer__item-label">{{ timerContent?.minutes }}</span>
    </span>

    <span class="bonuses-timer__dots">:</span>

    <span class="bonuses-timer__item" :class="{'has-null': state.seconds === 0}">
      <span class="bonuses-timer__item-digit">{{ format(state.seconds) }}</span>
      <span class="bonuses-timer__item-label">{{ timerContent?.seconds }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
  import type { IProfileBonuses } from "~/types";

  const props = defineProps<{
    expiredAt: string;
    timerContent?: IProfileBonuses['timer'];
  }>();

  const state = reactive<{
    isAlmostDone: boolean,
    diffInSeconds: number,
    days: string|number,
    hours: string|number,
    minutes: string|number,
    seconds: string|number,
  }>({
    isAlmostDone: false,
    diffInSeconds: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const format = (value: string|number): number|string => (Number(value) < 10 ? `0${value}` : value);

  const countdown = () => {
    const tick = () => {
      if (state.diffInSeconds <= 0) {
        state.isAlmostDone = true;
      } else {
        state.diffInSeconds -= 1;
        state.days = Math.floor(state.diffInSeconds / (24 * 3600));
        state.hours = Math.floor(state.diffInSeconds / 3600) % 24;
        state.minutes = Math.floor((state.diffInSeconds % 3600) / 60);
        state.seconds = state.diffInSeconds % 60;

        setTimeout(tick, 1000);
      }
    };

    tick();
  };

  onMounted(() => {
    const start = Date.now();
    const end = new Date(props.expiredAt).getTime();
    state.diffInSeconds = Math.ceil((end - start) / 1000);
    countdown();
  });
</script>

<style src="~/assets/styles/components/bonuses/timer.scss" lang="scss"/>