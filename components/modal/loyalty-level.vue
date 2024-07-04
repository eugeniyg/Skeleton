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

      <atomic-image class="img" src="/img/confirm.svg" />
      <p class="text">{{ getContent(popupsData, defaultLocalePopupsData, 'loyaltyLevel.title') }}</p>
      <button-base type="primary" size="md" @click="closeModal('loyaltyLevel')">
        {{ getContent(popupsData, defaultLocalePopupsData, 'loyaltyLevel.buttonLabel') }}
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

<style src="~/assets/styles/components/modal/loyalty-level.scss" lang="scss" />

