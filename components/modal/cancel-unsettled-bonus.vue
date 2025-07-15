<template>
  <vue-final-modal
    class="modal-confirm-bonus-unsettled"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('cancel-unsettled-bonus')" />
      </div>

      <atomic-image class="img" :src="getContent(props.currentLocaleData, props.defaultLocaleData, 'image')" />

      <div class="title">{{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}</div>

      <p class="text">{{ getContent(props.currentLocaleData, props.defaultLocaleData, 'description') }}</p>

      <atomic-bonus-progress
        :wagering-label="getContent(props.currentLocaleData, props.defaultLocaleData, 'wageringLabel')"
        :bonus-info="props.bonusInfo"
      />

      <div class="actions">
        <button-base type="primary" size="md" @click="closeModal('cancel-unsettled-bonus')">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'confirmButton') }}
        </button-base>

        <button-base type="ghost" size="xs" :is-disabled="bonusesUpdating" @click="emit('confirm')">
          <atomic-spinner :is-shown="props.bonusesUpdating" />
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'cancelButton') }}
        </button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IPlayerBonus } from '~/skeleton/api/types';
  import type { IConfirmBonusActionModal } from '~/types';

  const props = defineProps<{
    currentLocaleData: Maybe<IConfirmBonusActionModal>;
    defaultLocaleData: Maybe<IConfirmBonusActionModal>;
    bonusesUpdating?: boolean;
    bonusInfo?: IPlayerBonus;
  }>();

  const emit = defineEmits(['confirm']);
  const { closeModal } = useModalStore();
</script>

<style src="~/assets/styles/components/modal/confirm-bonus-unsettled.scss" lang="scss" />
