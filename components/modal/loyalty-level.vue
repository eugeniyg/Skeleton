<template>
  <vue-final-modal
    v-model="modals.loyaltyLevel"
    class="modal-loyalty-level"
    :clickToClose="false"
    @clickOutside="closeModal('loyaltyLevel')"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('loyaltyLevel')"/>
      </div>

      <div
        class="modal-loyalty-level__title"
        v-html="marked.parse(getContent(popupsData, defaultLocalePopupsData, 'loyaltyLevel.title') || '')"
      />
      
      <div class="modal-loyalty-level__images">
        <atomic-image class="modal-loyalty-level__images-back-bg" src="/img/uploads/loyalty-univerce.png" />
        
        <div class="modal-loyalty-level__avatar-wrap">
          <atomic-avatar-logo
            user-img="/img/avatar-bg.png"
            level-img="/img/uploads/achieve-1.png"
          />
        </div>
      </div>
      
      <div class="modal-loyalty-level__points">
        <div class="modal-loyalty-level__points-value">139 - 178</div>
        
        <div class="modal-loyalty-level__points-label">
          {{ getContent(popupsData, defaultLocalePopupsData, 'loyaltyLevel.statusLabel') }}
        </div>
      </div>
      
      
      <button-base type="primary" size="lg" @click="closeModal('loyaltyLevel')">
        {{ getContent(popupsData, defaultLocalePopupsData, 'loyaltyLevel.buttonLabel') }}
      </button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();
</script>

<style src="~/assets/styles/components/modal/loyalty-level.scss" lang="scss" />

