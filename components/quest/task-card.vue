<template>
  <div class="quest-task" :class="taskStatusClasses">
    <div class="quest-task__img">
      <atomic-image
        :src="
          getContent(
            globalComponentsContent,
            defaultLocaleGlobalComponentsContent,
            `constants.taskTypes.${props.taskInfo.type}.image`
          )
        "
      />
    </div>

    <div class="quest-task__body">
      <div class="quest-task__number">
        {{ getContent(questTasksContent, defaultLocaleQuestTasksContent, 'taskLabel') }} #{{ props.taskIndex + 1 }}
      </div>

      <div class="quest-task__title">
        {{
          getContent(
            globalComponentsContent,
            defaultLocaleGlobalComponentsContent,
            `constants.taskTypes.${props.taskInfo.type}.label`
          )
        }}
      </div>

      <quest-progress :task-list="[props.taskInfo]" show-label />
    </div>

    <div v-if="props.taskInfo.type === 2 && props.taskInfo.conditions.fields" class="quest-info-wrapper">
      <quest-task-fields :items="props.taskInfo.conditions.fields" />
    </div>

    <div v-else-if="props.taskInfo.type === 3 && winTaskConditions" class="quest-info-wrapper">
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

      <quest-games :task-type="props.taskInfo.type" :items="winTaskConditions.games" />
    </div>

    <div v-else-if="props.taskInfo.type === 4 && betTaskConditions" class="quest-info-wrapper">
      <quest-games-info
        :title="betTaskConditions.betAmountLabel"
        :min="betTaskConditions.betMin"
        :max="betTaskConditions.betMax"
      />

      <quest-games :task-type="props.taskInfo.type" :items="betTaskConditions.games" />
    </div>

    <div v-else-if="props.taskInfo.type === 6 && depositTaskConditions" class="quest-info-wrapper">
      <quest-deposit-info v-bind="depositTaskConditions" />
    </div>

    <span class="quest-task__type-icon">
      <atomic-image :src="statusImageSrc" />
    </span>
  </div>
</template>

<script setup lang="ts">
  import type { IPlayerQuestTask } from '@skeleton/core/types';
  import type { IQuestTasksModal } from '~/types';

  const props = defineProps<{
    taskInfo: IPlayerQuestTask;
    taskIndex: number;
    questState?: number;
  }>();

  const questTasksContent: Maybe<IQuestTasksModal> = inject('questTasksContent');
  const defaultLocaleQuestTasksContent: Maybe<IQuestTasksModal> = inject('defaultLocaleQuestTasksContent');

  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = useGlobalStore();
  const { getContent, formatBalance } = useProjectMethods();
  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);

  const getSumValue = (conditions: Record<string, any>, paramName: string): string => {
    const findException = conditions.currencies.find((item: any) => item.isoCode === activeAccount.value?.currency);
    let formatedSumObj;

    if (findException) {
      formatedSumObj = formatBalance(activeAccount.value?.currency, findException[paramName] || 0);
    } else {
      formatedSumObj = formatBalance(activeAccount.value?.currency, conditions[paramName] || 0);
    }

    return formatedSumObj?.amount ? `${formatedSumObj.amount} ${formatedSumObj.currency}` : '-';
  };

  interface IWinTaskInfo {
    multiplierLabel: string;
    winLabel: string;
    multiplierMin: number | string;
    multiplierMax: number | string;
    winMin: string;
    winMax: string;
    games: string[];
  }

  const winTaskConditions = computed<IWinTaskInfo | undefined>(() => {
    if (props.taskInfo.type !== 3) return undefined;

    const multiplierLabel = getContent(questTasksContent, defaultLocaleQuestTasksContent, 'multiplierLabel');
    const winLabel = getContent(questTasksContent, defaultLocaleQuestTasksContent, 'winLabel');
    const multiplierMin = props.taskInfo.conditions.multiplier || '-';
    const multiplierMax = props.taskInfo.conditions.maxMultiplier || '-';
    const winMin = getSumValue(props.taskInfo.conditions, 'minPayout');
    const winMax = getSumValue(props.taskInfo.conditions, 'maxPayout');
    const games = props.taskInfo.conditions.games || [];

    return { multiplierLabel, winLabel, multiplierMin, multiplierMax, winMin, winMax, games };
  });

  interface IBetTaskInfo {
    betAmountLabel: string;
    betMin: string;
    betMax: string;
    games: string[];
  }

  const betTaskConditions = computed<IBetTaskInfo | undefined>(() => {
    if (props.taskInfo.type !== 4) return undefined;

    const betAmountLabel = getContent(questTasksContent, defaultLocaleQuestTasksContent, 'betAmountLabel');
    const betMin = getSumValue(props.taskInfo.conditions, 'spinAmount');
    const betMax = getSumValue(props.taskInfo.conditions, 'maxSpinAmount');
    const games = props.taskInfo.conditions.games || [];

    return { betAmountLabel, betMin, betMax, games };
  });

  interface IDepositTaskInfo {
    depositMin: string;
    depositMax: string;
  }

  const depositTaskConditions = computed<IDepositTaskInfo | undefined>(() => {
    if (props.taskInfo.type !== 6) return undefined;

    const depositMin = getSumValue(props.taskInfo.conditions, 'minAmount');
    const depositMax = getSumValue(props.taskInfo.conditions, 'maxAmount');

    return { depositMin, depositMax };
  });

  const statusImageSrc = computed(() => {
    if (props.questState !== 2) return '/img/quests/task-locked.png';
    if (props.taskInfo.progress === props.taskInfo.quantity) return '/img/quests/task-completed.png';
    if (props.taskInfo.isActive) return '/img/quests/task-active.png';
    return '/img/quests/task-locked.png';
  });

  const taskStatusClasses = computed(() => ({
    'is-active': props.questState === 2 && props.taskInfo.isActive,
    'is-completed': props.questState === 2 && props.taskInfo.progress === props.taskInfo.quantity,
    'is-bw-enabled': props.questState !== 2 || !props.taskInfo.isActive,
  }));
</script>

<style src="~/assets/styles/components/quest/task-card.scss" lang="scss" />
