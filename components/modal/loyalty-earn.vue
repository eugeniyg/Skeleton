<template>
  <vue-final-modal
    v-model="modals.loyaltyEarn"
    class="modal-loyalty-earn"
    :clickToClose="false"
    @clickOutside="closeModal('loyaltyEarn')"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('loyaltyEarn')"/>
      </div>

      <atomic-image class="img" src="/img/confirm.svg" />
      
      <p class="text">{{ getContent(popupsData, defaultLocalePopupsData, 'loyaltyEarn.title') }}</p>
      
      <button-base type="primary" size="md" @click="closeModal('loyaltyEarn')">
        {{ getContent(popupsData, defaultLocalePopupsData, 'loyaltyEarn.buttonLabel') }}
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

