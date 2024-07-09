<template>
  <div
    class="quest-task"
    :class="taskStatusClasses"
  >
    <div class="quest-task__img">
      <atomic-image
        :src="getContent(popupsData, defaultLocalePopupsData, `questTasks.taskTypes.${props.taskInfo.type}.image`)"
      />
    </div>

    <div class="quest-task__body">
      <div class="quest-task__number">
        {{ getContent(popupsData, defaultLocalePopupsData, 'questTasks.taskLabel') }} #{{ props.taskIndex + 1 }}
      </div>

      <div class="quest-task__title">
        {{ getContent(popupsData, defaultLocalePopupsData, `questTasks.taskTypes.${props.taskInfo.type}.label`) }}
      </div>

      <quest-progress :taskList="[props.taskInfo]" showLabel />
    </div>

    <div v-if="[2,3,4].includes(props.taskInfo.type)" class="quest-info-wrapper">
      <template v-if="props.taskInfo.type === 3 && winTaskConditions">
        <quest-games-info
          :title="winTaskConditions.multiplierLabel"
          :min="winTaskConditions.multiplierMin"
          :max="winTaskConditions.multiplierMax"
        />

        <quest-games-info
          :title="winTaskConditions.winLabel"
          :min="winTaskConditions.winMin"
          :max="winTaskConditions.winMax"
        />

        <quest-games :taskType="props.taskInfo.type" :items="winTaskConditions.games" />
      </template>

      <template v-else-if="props.taskInfo.type === 4 && betTaskConditions">
        <quest-games-info
          :title="betTaskConditions.betAmountLabel"
          :min="betTaskConditions.betMin"
          :max="betTaskConditions.betMax"
        />

        <quest-games :taskType="props.taskInfo.type" :items="betTaskConditions.games" />
      </template>

      <quest-task-fields
        v-else-if="props.taskInfo.type === 2 && props.taskInfo.conditions.fields"
        :items="props.taskInfo.conditions.fields"
      />
    </div>

    <span class="quest-task__type-icon">
      <atomic-image :src="statusImageSrc"/>
    </span>
  </div>
</template>

<script setup lang="ts">
  import type { IPlayerQuestTask } from "@skeleton/core/types";

  const props = defineProps<{
    taskInfo: IPlayerQuestTask;
    taskIndex: number;
    questState?: number;
  }>()

  const { getContent } = useProjectMethods();
  const globalStore = useGlobalStore();
  const {
    popupsData,
    defaultLocalePopupsData
  } = storeToRefs(globalStore);

  interface IWinTaskInfo {
    multiplierLabel: string;
    winLabel: string;
    multiplierMin: number|string;
    multiplierMax: number|string;
    winMin: string;
    winMax: string;
    games: string[];
  }

  const winTaskConditions = computed<IWinTaskInfo|undefined>(() => {
    if (props.taskInfo.type !== 3) return undefined;

    const multiplierLabel = getContent(popupsData.value, defaultLocalePopupsData.value, 'questTasks.multiplierLabel');
    const winLabel = getContent(popupsData.value, defaultLocalePopupsData.value, 'questTasks.winLabel');
    const multiplierMin = props.taskInfo.conditions.multiplier || '-';
    const multiplierMax = props.taskInfo.conditions.maxMultiplier || '-';
    const winMin = '-';
    const winMax = '-';
    const games = props.taskInfo.conditions.games || [];

    return {
      multiplierLabel,
      winLabel,
      multiplierMin,
      multiplierMax,
      winMin,
      winMax,
      games
    }
  })

  interface IBetTaskInfo {
    betAmountLabel: string;
    betMin: string;
    betMax: string;
    games: string[];
  }

  const betTaskConditions = computed<IBetTaskInfo|undefined>(() => {
    if (props.taskInfo.type !== 4) return undefined;

    const betAmountLabel = getContent(popupsData.value, defaultLocalePopupsData.value, 'questTasks.betAmountLabel');
    const betMin = '-';
    const betMax = '-';
    const games = props.taskInfo.conditions.games || [];

    return {
      betAmountLabel,
      betMin,
      betMax,
      games
    }
  })

  const statusImageSrc = computed(() => {
    if (props.questState !== 2) return '/img/quests/task-locked.png';
    if (props.taskInfo.progress === props.taskInfo.quantity) return '/img/quests/task-completed.png';
    if (props.taskInfo.isActive) return '/img/quests/task-active.png';
    return '/img/quests/task-locked.png';
  })

  const taskStatusClasses = computed(() => ({
    'is-active': props.questState === 2 && props.taskInfo.isActive,
    'is-completed': props.questState === 2 && (props.taskInfo.progress === props.taskInfo.quantity),
    'is-bw-enabled': props.questState !== 2 || !props.taskInfo.isActive
  }));
</script>

<style src="~/assets/styles/components/quest/task-card.scss" lang="scss"/>