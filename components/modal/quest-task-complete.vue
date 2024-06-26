<template>
  <vue-final-modal
    v-model="modals.questTaskComplete"
    class="modal-quest-task-complete"
    :clickToClose="false"
    @clickOutside="closeModal('confirm')"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('questTaskComplete')"/>
      </div>
      <div class="modal-quest-task-complete__img">
        <atomic-image class="img" :src="getContent(popupsData, defaultLocalePopupsData, 'questTaskComplete.image')" />
      </div>
      <div class="modal-quest-task-complete__title">{{ getContent(popupsData, defaultLocalePopupsData, 'questTaskComplete.title') }}</div>
      <p class="modal-quest-task-complete__description">{{ getContent(popupsData, defaultLocalePopupsData, 'questTaskComplete.description') }}</p>
      
      <quest-progress :columns="5" :width="33"/>
      
      <button-base type="primary" size="lg" @click="closeModal('confirm')">
        {{ getContent(popupsData, defaultLocalePopupsData, 'questTaskComplete.buttonLabel') }}
      </button-base>
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
</script>

<style src="~/assets/styles/components/modal/quest-task-complete.scss" lang="scss" />


