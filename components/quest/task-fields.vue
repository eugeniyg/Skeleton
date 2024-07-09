<template>
  <div class="quest-task-fields">
    <div class="quest-task-fields__title">
      {{ getContent(popupsData, defaultLocalePopupsData, 'questTasks.fieldsLabel') }}
    </div>

    <div class="quest-task-fields__items">
      <span v-for="field in props.items" :key="field" class="quest-task-fields__item">
        <atomic-image src="/img/quests/field-check-img.png" />
        <span>
          {{ getContent(fieldsSettings, defaultLocaleFieldsSettings, `fieldsControls.${field}.label`) }}
        </span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    items: string[];
  }>();

  const { getContent } = useProjectMethods();
  const globalStore = useGlobalStore();
  const {
    popupsData,
    defaultLocalePopupsData,
    fieldsSettings,
    defaultLocaleFieldsSettings
  } = storeToRefs(globalStore);
</script>

<style src="~/assets/styles/components/quest/task-fields.scss" lang="scss"/>