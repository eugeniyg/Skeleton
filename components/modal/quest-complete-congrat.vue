<template>
  <vue-final-modal
    v-model="modals.questCompleteCongrat"
    class="modal-quest-complete-congrat"
    :clickToClose="false"
    @clickOutside="closeModal('questCompleteCongrat')"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('questCompleteCongrat')"/>
      </div>
      
      <div class="modal-quest-complete-congrat__img">
        <atomic-image class="img" :src="getContent(popupsData, defaultLocalePopupsData, 'questCompleteCongrat.image')" />
      </div>
      
      <div class="modal-quest-complete-congrat__title">
        {{ getContent(popupsData, defaultLocalePopupsData, 'questCompleteCongrat.title') }}
      </div>
      
      <div class="modal-quest-complete-congrat__description">
        {{ getContent(popupsData, defaultLocalePopupsData, 'questCompleteCongrat.description') }}
      </div>
      
      <button-base type="primary" size="lg" @click="closeModal('questCompleteCongrat')">
        {{ getContent(popupsData, defaultLocalePopupsData, 'questCompleteCongrat.buttonLabel') }}
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

<style src="~/assets/styles/components/modal/quest-complete-congrat.scss" lang="scss" />

