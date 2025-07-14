<template>
  <div class="quest-games-info">
    <div class="quest-games-info__title">{{ props.title }}</div>

    <div class="quest-games-info__items">
      <div class="quest-games-info__item">
        <span class="quest-games-info__label">
          {{ getContent(questTasksContent, defaultLocaleQuestTasksContent, 'minLabel') }}:
        </span>

        <span class="quest-games-info__value">{{ props.min }}</span>
      </div>

      <div class="quest-games-info__item">
        <span class="quest-games-info__label">
          {{ getContent(questTasksContent, defaultLocaleQuestTasksContent, 'maxLabel') }}:
        </span>

        <span class="quest-games-info__value">{{ props.max }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IQuestTasksModal } from '~/types';

  const props = defineProps<{
    title: string;
    min: string | number;
    max: string | number;
  }>();

  const questTasksContent: Maybe<IQuestTasksModal> = inject('questTasksContent');
  const defaultLocaleQuestTasksContent: Maybe<IQuestTasksModal> = inject('defaultLocaleQuestTasksContent');
</script>

<style src="~/assets/styles/components/quest/games-info.scss" lang="scss" />
