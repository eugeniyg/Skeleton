<template>
  <div class="quest-tasks-card-timer">
    <span class="quest-tasks-card-timer__item" :class="{'has-null': days === 0}">
      <span class="quest-tasks-card-timer__item-time">{{ format(days)  }}</span>
      <span class="quest-tasks-card-timer__item-label">
        {{ getContent(popupsData, defaultLocalePopupsData, 'questTasks.timer.days') }}
      </span>
    </span>

    <span class="quest-tasks-card-timer__dots">:</span>

    <span class="quest-tasks-card-timer__item" :class="{'has-null': hours === 0}">
      <span class="quest-tasks-card-timer__item-time">{{ format(hours) }}</span>
      <span class="quest-tasks-card-timer__item-label">
        {{ getContent(popupsData, defaultLocalePopupsData, 'questTasks.timer.hours') }}
      </span>
    </span>

    <span class="quest-tasks-card-timer__dots">:</span>

    <span class="quest-tasks-card-timer__item" :class="{'has-null': minutes === 0}">
      <span class="quest-tasks-card-timer__item-time">{{ format(minutes) }}</span>
      <span class="quest-tasks-card-timer__item-label">
        {{ getContent(popupsData, defaultLocalePopupsData, 'questTasks.timer.minutes') }}
      </span>
    </span>

    <span class="quest-tasks-card-timer__dots">:</span>

    <span class="quest-tasks-card-timer__item" :class="{'has-null': seconds === 0}">
      <span class="quest-tasks-card-timer__item-time">{{ format(seconds) }}</span>
      <span class="quest-tasks-card-timer__item-label">
        {{ getContent(popupsData, defaultLocalePopupsData, 'questTasks.timer.seconds') }}
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    expiredAt: any;
  }>();

  const { getContent } = useProjectMethods();
  const globalStore = useGlobalStore();
  const {
    popupsData,
    defaultLocalePopupsData
  } = storeToRefs(globalStore);

  const {
    days,
    hours,
    minutes,
    seconds,
    startTimer
  } = useTimer();

  const format = (value: string|number): number|string => (Number(value) < 10 ? `0${value}` : value);

  onMounted(() => {
    if (props.expiredAt) startTimer(props.expiredAt);
  });
</script>

<style src="~/assets/styles/components/quest/tasks-card-timer.scss" lang="scss"/>