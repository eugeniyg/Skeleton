<template>
  <button-base
    class="button-resend"
    type="secondary"
    size="sm"
    @click="resend"
    :is-disabled="state.isShowTimer"
  >
    <span v-if="state.isShowTimer" class="button-resend__timer">
      <span>{{ format(state.minutes) }}</span>
      <span>:</span>
      <span>{{ format(state.seconds) }}</span>
    </span>
    
    <span>Resend code</span>
  </button-base>
</template>

<script setup lang="ts">
  const state = reactive({
    isShowTimer: false,
    isAlmostDone: false,
    diffInSeconds: 3600,
    minutes: 0,
    seconds: 0,
  });
  
  const format = (value: number): number | string => (value < 10 ? `0${value}` : value);
  
  const runCountdown = () => {
    const tick = () => {
      if (state.diffInSeconds <= 0) {
        state.isAlmostDone = true;
      } else {
        state.diffInSeconds -= 1;
        state.minutes = Math.floor((state.diffInSeconds % 3600) / 60);
        state.seconds = state.diffInSeconds % 60;
        
        setTimeout(tick, 1000);
      }
    };
    
    tick();
  };
  
  const resend = () => {
    state.isShowTimer = true;
    runCountdown();
  };
</script>

<style src="~/assets/styles/components/button/resend.scss" lang="scss"/>