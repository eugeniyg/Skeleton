<template>
  <div class="quest-timer">
    <span class="quest-timer__item" :class="{'has-null': state.days === 0}">
      {{ format(state.days)  }}
    </span>

    <span class="quest-timer__dots">:</span>
    <span class="quest-timer__item" :class="{'has-null': state.hours === 0}">
      {{ format(state.hours) }}
    </span>

    <span class="quest-timer__dots">:</span>
    <span class="quest-timer__item" :class="{'has-null': state.minutes === 0}">
      {{ format(state.minutes) }}
    </span>

    <span class="quest-timer__dots">:</span>
    <span class="quest-timer__item" :class="{'has-null': state.seconds === 0}">
      {{ format(state.seconds) }}
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  expiredAt: string;
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

<style src="~/assets/styles/components/quest/timer.scss" lang="scss"/>