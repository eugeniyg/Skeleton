<template>
  <div class="quest-progress">
    <div class="quest-progress__container">
      <div v-if="props.showLabel && columns.length === 1" class="quest-progress__label">
        {{ taskList[0].progress }}/{{ taskList[0].quantity }}
      </div>

      <div class="quest-progress__items">
        <div
          v-for="(progress, index) in columns"
          :key="index"
          class="quest-progress__item"
          :style="`--column-width: ${progress}%`"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IPlayerQuestTask } from '@skeleton/api/types';

  const props = defineProps<{
    taskList: IPlayerQuestTask[];
    showLabel?: boolean;
  }>();

  const columns = computed(() => {
    return props.taskList
      .map(task => {
        const progressFloat = (task.progress / task.quantity) * 100;
        return Math.round(progressFloat * 100) / 100;
      })
      .sort((prevProgress, nextProgress) => nextProgress - prevProgress);
  });
</script>

<style src="~/assets/styles/components/quest/progress.scss" lang="scss" />
