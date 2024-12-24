<template>
  <div class="quest-deposit-info">
    <div class="quest-deposit-info__title">
      {{ getContent(questTasksContent, defaultLocaleQuestTasksContent, 'depositAmountLabel') }}
    </div>

    <div class="quest-deposit-info__items">
      <div v-if="props.depositMin" class="quest-deposit-info__item">
        <span class="quest-deposit-info__label">
          {{ getContent(questTasksContent, defaultLocaleQuestTasksContent, 'minLabel') }}:
        </span>

        <span class="quest-deposit-info__value">{{ props.depositMin }}</span>
      </div>

      <div v-if="props.depositMax" class="quest-deposit-info__item">
        <span class="quest-deposit-info__label">
          {{ getContent(questTasksContent, defaultLocaleQuestTasksContent, 'maxLabel') }}:
        </span>

        <span class="quest-deposit-info__value">{{ props.depositMax }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IQuestTasksModal } from '~/types';

  const props = defineProps<{
    depositMin?: string;
    depositMax?: string;
  }>();

  const questTasksContent: Maybe<IQuestTasksModal> = inject('questTasksContent');
  const defaultLocaleQuestTasksContent: Maybe<IQuestTasksModal> = inject('defaultLocaleQuestTasksContent');

  const { getContent } = useProjectMethods();
</script>

<style src="~/assets/styles/components/quest/deposit-info.scss" lang="scss" />
