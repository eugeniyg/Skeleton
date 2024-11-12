<template>
  <vue-final-modal
    :model-value="props.showModal"
    class="modal-confirm-bonus"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="emit('closeModal')" />
        <div class="title">{{ props.title }}</div>
      </div>

      <p class="text">{{ props.description }}</p>

      <div class="actions">
        <button-base type="primary" size="md" :is-disabled="bonusesUpdating" @click="emit('confirm')">
          <atomic-spinner :is-shown="props.bonusesUpdating" />
          {{ props.confirmButton }}
        </button-base>
        <button-base type="secondary" size="md" @click="emit('closeModal')">{{ props.cancelButton }}</button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';

  const props = defineProps<{
    showModal: boolean;
    title?: string;
    description?: string;
    confirmButton?: string;
    cancelButton?: string;
    bonusesUpdating?: boolean;
  }>();

  const emit = defineEmits(['closeModal', 'confirm']);
</script>

<style src="~/assets/styles/components/modal/confirm-bonus.scss" lang="scss" />
