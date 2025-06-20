<template>
  <div class="wheel-timer">
    <atomic-picture class="wheel-timer__bg" :src="timerBgImage" />

    <div class="wheel-timer__body">
      <div class="wheel-timer__label">{{ props.wheelData.state === 2 ? scheduledTimerLabel : activeTimerLabel }}</div>

      <div class="wheel-timer__digits">
        <span class="wheel-timer__item" :class="{ 'has-null': days === 0 }">
          <span class="wheel-timer__item-digit">{{ format(days) }}</span>
          <span class="wheel-timer__item-label">{{ daysLabel }}</span>
        </span>

        <span class="wheel-timer__dots">:</span>

        <span class="wheel-timer__item" :class="{ 'has-null': hours === 0 }">
          <span class="wheel-timer__item-digit">{{ format(hours) }}</span>
          <span class="wheel-timer__item-label">{{ hoursLabel }}</span>
        </span>

        <span class="wheel-timer__dots">:</span>

        <span class="wheel-timer__item" :class="{ 'has-null': minutes === 0 }">
          <span class="wheel-timer__item-digit">{{ format(minutes) }}</span>
          <span class="wheel-timer__item-label">{{ minutesLabel }}</span>
        </span>

        <span class="wheel-timer__dots">:</span>

        <span class="wheel-timer__item" :class="{ 'has-null': seconds === 0 }">
          <span class="wheel-timer__item-digit">{{ format(seconds) }}</span>
          <span class="wheel-timer__item-label">{{ secondsLabel }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IWheelCommon } from '~/types';
  import type { IWheel } from '@skeleton/core/types/wheelsTypes';

  const props = defineProps<{
    expiredAt: string;
    wheelData: IWheel;
    currentLocaleContent: Maybe<IWheelCommon>;
    defaultLocaleContent: Maybe<IWheelCommon>;
  }>();

  const emit = defineEmits(['timesUp']);
  const { getContent } = useProjectMethods();
  const timerBgImage = computed(() =>
    getContent(props.currentLocaleContent, props.defaultLocaleContent, 'timer.backgroundImage')
  );
  const scheduledTimerLabel = computed(() =>
    getContent(props.currentLocaleContent, props.defaultLocaleContent, 'timer.scheduledTimerLabel')
  );
  const activeTimerLabel = computed(() =>
    getContent(props.currentLocaleContent, props.defaultLocaleContent, 'timer.activeTimerLabel')
  );
  const daysLabel = computed(() => getContent(props.currentLocaleContent, props.defaultLocaleContent, 'timer.days'));
  const hoursLabel = computed(() => getContent(props.currentLocaleContent, props.defaultLocaleContent, 'timer.hours'));
  const minutesLabel = computed(() =>
    getContent(props.currentLocaleContent, props.defaultLocaleContent, 'timer.minutes')
  );
  const secondsLabel = computed(() =>
    getContent(props.currentLocaleContent, props.defaultLocaleContent, 'timer.seconds')
  );

  const { days, hours, minutes, seconds, isAlmostDone, startTimer } = useTimer();
  const format = (value: string | number): number | string => (Number(value) < 10 ? `0${value}` : value);

  watch(isAlmostDone, () => {
    emit('timesUp');
  });

  onMounted(() => {
    startTimer(props.expiredAt);
  });
</script>

<style src="~/assets/styles/components/wheel/timer.scss" lang="scss" />
