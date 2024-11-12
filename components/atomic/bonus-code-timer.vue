<template>
  <div class="bonus-code-timer">
    <atomic-icon id="history" />

    <div class="time">
      <span class="value">{{ Math.floor(currentTime / 60) }}</span>
      <span class="title">m</span>
      &#160;
      <span class="value">{{ String(currentTime % 60).padStart(2, '0') }}</span>
      <span class="title">s</span>
    </div>

    <div class="message">{{ props.timerText }}</div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    timerValue: number;
    timerText?: string;
  }>();

  const timer = ref<any>(undefined);
  const currentTime = ref<number>(props.timerValue);
  const emit = defineEmits(['timeOut']);

  const startTimer = (): void => {
    timer.value = setInterval(() => {
      if (currentTime.value === 0) {
        clearInterval(timer.value);
        emit('timeOut');
        return;
      }
      currentTime.value -= 1;
    }, 1000);
  };

  onMounted(() => {
    startTimer();
  });

  onBeforeUnmount(() => {
    clearInterval(timer.value);
  });
</script>

<style src="~/assets/styles/components/atomic/bonus-code-timer.scss" lang="scss" />
