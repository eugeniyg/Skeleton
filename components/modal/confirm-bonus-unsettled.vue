<template>
  <vue-final-modal
    :model-value="props.showModal"
    class="modal-confirm-bonus-unsettled"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="emit('closeModal')" />
      </div>

      <atomic-image class="img" :src="props.image" />

      <div class="title">{{ props.title }}</div>

      <p class="text">{{ props.description }}</p>

      <atomic-bonus-progress :wagering-label="props.wageringLabel" :bonus-info="props.bonusInfo" />

      <div class="actions">
        <button-base type="primary" size="md" @click="emit('closeModal')">
          {{ props.confirmButton }}
        </button-base>

        <button-base type="ghost" size="xs" :is-disabled="bonusesUpdating" @click="emit('confirm')">
          <atomic-spinner :is-shown="props.bonusesUpdating" />
          {{ props.cancelButton }}
        </button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IPlayerBonus } from '~/skeleton/core/types';

  const props = defineProps<{
    showModal: boolean;
    title?: string;
    image?: string;
    description?: string;
    confirmButton?: string;
    cancelButton?: string;
    bonusesUpdating?: boolean;
    bonusInfo?: IPlayerBonus;
    wageringLabel?: string;
  }>();

  const emit = defineEmits(['closeModal', 'confirm']);
</script>

<style src="~/assets/styles/components/modal/confirm-bonus-unsettled.scss" lang="scss" />
