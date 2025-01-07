<template>
  <vue-final-modal
    class="modal-confirm-bonus"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeHandle" />
        <div class="title">{{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}</div>
      </div>

      <p class="text">{{ getContent(props.currentLocaleData, props.defaultLocaleData, 'description') }}</p>

      <div class="actions">
        <button-base type="primary" size="md" :is-disabled="bonusesUpdating" @click="emit('confirm')">
          <atomic-spinner :is-shown="props.bonusesUpdating" />
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'confirmButton') }}
        </button-base>

        <button-base type="secondary" size="md" @click="closeHandle">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'cancelButton') }}
        </button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IConfirmBonusActionModal } from '~/types';

  const props = defineProps<{
    currentLocaleData: Maybe<IConfirmBonusActionModal>;
    defaultLocaleData: Maybe<IConfirmBonusActionModal>;
    bonusesUpdating?: boolean;
  }>();

  const { getContent } = useProjectMethods();
  const modalStore = useModalStore();
  const componentModals = ['change-active-bonus', 'cancel-active-bonus', 'cancel-issued-bonus'];
  const closeHandle = (): void => {
    componentModals.forEach(modalName => {
      if (modalStore.modals[modalName]?.options?.modelValue) modalStore.closeModal(modalName);
    });
  };

  const emit = defineEmits(['confirm']);
</script>

<style src="~/assets/styles/components/modal/confirm-bonus.scss" lang="scss" />
