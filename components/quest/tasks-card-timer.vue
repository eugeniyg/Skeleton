<template>
  <div class="quest-tasks-card-timer">
    <span class="quest-tasks-card-timer__item" :class="{ 'has-null': days === 0 }">
      <span class="quest-tasks-card-timer__item-time">{{ format(days) }}</span>
      <span class="quest-tasks-card-timer__item-label">
        {{ getContent(questTasksContent, defaultLocaleQuestTasksContent, 'timer.days') }}
      </span>
    </span>

    <span class="quest-tasks-card-timer__dots">:</span>

    <span class="quest-tasks-card-timer__item" :class="{ 'has-null': hours === 0 }">
      <span class="quest-tasks-card-timer__item-time">{{ format(hours) }}</span>
      <span class="quest-tasks-card-timer__item-label">
        {{ getContent(questTasksContent, defaultLocaleQuestTasksContent, 'timer.hours') }}
      </span>
    </span>

    <span class="quest-tasks-card-timer__dots">:</span>

    <span class="quest-tasks-card-timer__item" :class="{ 'has-null': minutes === 0 }">
      <span class="quest-tasks-card-timer__item-time">{{ format(minutes) }}</span>
      <span class="quest-tasks-card-timer__item-label">
        {{ getContent(questTasksContent, defaultLocaleQuestTasksContent, 'timer.minutes') }}
      </span>
    </span>

    <span class="quest-tasks-card-timer__dots">:</span>

    <span class="quest-tasks-card-timer__item" :class="{ 'has-null': seconds === 0 }">
      <span class="quest-tasks-card-timer__item-time">{{ format(seconds) }}</span>
      <span class="quest-tasks-card-timer__item-label">
        {{ getContent(questTasksContent, defaultLocaleQuestTasksContent, 'timer.seconds') }}
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
  import type { IQuestTasksModal } from '~/types';

  const props = defineProps<{
    expiredAt: any;
  }>();

  const questTasksContent: Maybe<IQuestTasksModal> = inject('questTasksContent');
  const defaultLocaleQuestTasksContent: Maybe<IQuestTasksModal> = inject('defaultLocaleQuestTasksContent');

  const { getContent } = useProjectMethods();
  const { days, hours, minutes, seconds, startTimer } = useTimer();
  const format = (value: string | number): number | string => (Number(value) < 10 ? `0${value}` : value);

  onMounted(() => {
    if (props.expiredAt) startTimer(props.expiredAt);
  });
</script>

<style src="~/assets/styles/components/quest/tasks-card-timer.scss" lang="scss" />
