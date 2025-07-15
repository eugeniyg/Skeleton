<template>
  <div class="bonuses-timer">
    <span class="bonuses-timer__item" :class="{ 'has-null': days === 0 }">
      <span class="bonuses-timer__item-digit">{{ format(days) }}</span>
      <span v-if="!props.hideLabels" class="bonuses-timer__item-label">{{ timerContent?.days }}</span>
    </span>

    <span class="bonuses-timer__dots">:</span>

    <span class="bonuses-timer__item" :class="{ 'has-null': hours === 0 }">
      <span class="bonuses-timer__item-digit">{{ format(hours) }}</span>
      <span v-if="!props.hideLabels" class="bonuses-timer__item-label">{{ timerContent?.hours }}</span>
    </span>

    <span class="bonuses-timer__dots">:</span>

    <span class="bonuses-timer__item" :class="{ 'has-null': minutes === 0 }">
      <span class="bonuses-timer__item-digit">{{ format(minutes) }}</span>
      <span v-if="!props.hideLabels" class="bonuses-timer__item-label">{{ timerContent?.minutes }}</span>
    </span>

    <span class="bonuses-timer__dots">:</span>

    <span class="bonuses-timer__item" :class="{ 'has-null': seconds === 0 }">
      <span class="bonuses-timer__item-digit">{{ format(seconds) }}</span>
      <span v-if="!props.hideLabels" class="bonuses-timer__item-label">{{ timerContent?.seconds }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    expiredAt: string;
    hideLabels?: boolean;
  }>();

  const { days, hours, minutes, seconds, startTimer } = useTimer();

  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = storeToRefs(globalStore);

  const timerContent = computed(() =>
    getContent(globalComponentsContent.value, defaultLocaleGlobalComponentsContent.value, 'bonuses.timer')
  );

  const format = (value: string | number): number | string => (Number(value) < 10 ? `0${value}` : value);

  onMounted(() => {
    startTimer(props.expiredAt);
  });
</script>

<style src="~/assets/styles/components/bonuses/timer.scss" lang="scss" />
