<template>
  <div class="quest-progress">
    <div class="quest-progress__container">
      <div class="quest-progress__items">
        <div
          v-for="progress in columns"
          class="quest-progress__item"
          :style="`--column-width: ${progress}%`"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IPlayerQuestTask } from "@skeleton/core/types";

  const props = defineProps<{
    taskList: IPlayerQuestTask[];
  }>();

  const columns = computed(() => {
    return props.taskList.map(task => {
      const progressFloat = task.progress / task.quantity * 100;
      return Math.round(progressFloat * 100) / 100;
    }).sort((prevProgress, nextProgress) => nextProgress - prevProgress);
  })
</script>

<style src="~/assets/styles/components/quest/progress.scss" lang="scss"/>