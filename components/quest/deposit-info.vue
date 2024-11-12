<template>
  <div class="quest-deposit-info">
    <div class="quest-deposit-info__title">
      {{ getContent(popupsData, defaultLocalePopupsData, 'questTasks.depositAmountLabel') }}
    </div>

    <div class="quest-deposit-info__items">
      <div v-if="props.depositMin" class="quest-deposit-info__item">
        <span class="quest-deposit-info__label">
          {{ getContent(popupsData, defaultLocalePopupsData, 'questTasks.minLabel') }}:
        </span>

        <span class="quest-deposit-info__value">{{ props.depositMin }}</span>
      </div>

      <div v-if="props.depositMax" class="quest-deposit-info__item">
        <span class="quest-deposit-info__label">
          {{ getContent(popupsData, defaultLocalePopupsData, 'questTasks.maxLabel') }}:
        </span>

        <span class="quest-deposit-info__value">{{ props.depositMax }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    depositMin?: string;
    depositMax?: string;
  }>();

  const { getContent } = useProjectMethods();
  const globalStore = useGlobalStore();
  const { popupsData, defaultLocalePopupsData } = storeToRefs(globalStore);
</script>

<style src="~/assets/styles/components/quest/deposit-info.scss" lang="scss" />
