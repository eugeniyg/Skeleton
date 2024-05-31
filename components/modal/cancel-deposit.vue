<template>
  <vue-final-modal
    v-model="modals.cancelDeposit"
    class="modal-cancel-deposit"
    :clickToClose="false"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('cancelDeposit')" />

        <div class="title">
          {{ getContent(popupsData, defaultLocalePopupsData, 'cancelDeposit.title') }}
        </div>
      </div>

      <div
        v-if="modalContent"
        class="modal-cancel-deposit__content"
        v-html="marked.parse(modalContent)"
      />

      <div class="modal-cancel-deposit__actions">
        <button-base type="primary" size="md" @click="closeModal('cancelDeposit')">
          {{ getContent(popupsData, defaultLocalePopupsData, 'cancelDeposit.primaryButton') }}
        </button-base>

        <button-base type="secondary" size="md" @click="closeModal('cancelDeposit')">
          {{ getContent(popupsData, defaultLocalePopupsData, 'cancelDeposit.secondaryButton') }}
        </button-base>

        <button-base size="xs" type="ghost" @click="closeDeposit">
          {{ getContent(popupsData, defaultLocalePopupsData, 'cancelDeposit.confirm') }}
        </button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { marked } from 'marked';
  import { VueFinalModal } from 'vue-final-modal';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const closeDeposit = (): void => {
    closeModal('wallet');
    closeModal('cancelDeposit');
  }

  const modalContent = getContent(popupsData, defaultLocalePopupsData, 'cancelDeposit.content');
</script>

<style src="~/assets/styles/components/modal/cancel-deposit.scss" lang="scss" />

