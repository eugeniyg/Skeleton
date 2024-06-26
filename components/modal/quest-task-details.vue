<template>
  <vue-final-modal
    v-model="modals.questTaskDetails"
    class="modal-quest-task-details"
    :clickToClose="false"
    @clickOutside="closeModal('questTaskDetails')"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('questTaskDetails')"/>
        <div class="title">{{ getContent(popupsData, defaultLocalePopupsData, 'questTaskDetails.title') }}</div>
      </div>
      
      <div class="modal-quest-task-details__content">
        <div v-for="([key, value]) in Object.entries(questTaskDetailsItems)" class="modal-quest-task-details__item">
          <span class="modal-quest-task-details__label">
            {{ getContent(popupsData, defaultLocalePopupsData, `questTaskDetails.${key}Label]`) }}
          </span>
          <span class="modal-quest-task-details__value">{{ Array.isArray(value) ? value.join(', ') : value }}</span>
        </div>
      </div>
      
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';
  
  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();
  
  const { questTaskDetailsItems } = useFakeStore();
  
</script>

<style src="~/assets/styles/components/modal/quest-task-details.scss" lang="scss" />

