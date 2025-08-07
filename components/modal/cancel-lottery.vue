<template>
  <vue-final-modal
    class="modal-cancel-lottery"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('cancel-lottery')" />
      </div>

      <atomic-image class="img" :src="getContent(props.currentLocaleData, props.defaultLocaleData, 'image')" />

      <div class="title">{{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}</div>

      <p class="text">{{ getContent(props.currentLocaleData, props.defaultLocaleData, 'description') }}</p>

      <div class="modal-cancel-lottery__actions">
        <button-base type="primary" size="md" @click="closeModal('cancel-lottery')">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'cancelButton') }}
        </button-base>

        <button-base type="ghost" size="xs" :is-disabled="bonusesUpdating" @click="emit('confirm')">
          <atomic-spinner :is-shown="props.bonusesUpdating" />
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'confirmButton') }}
        </button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IPlayerBonus } from '~/skeleton/api/types';
  import type { IConfirmBonusActionModal } from '~/types';
  import { getContent } from '#imports';

  const props = defineProps<{
    currentLocaleData: Maybe<IConfirmBonusActionModal>;
    defaultLocaleData: Maybe<IConfirmBonusActionModal>;
    bonusesUpdating?: boolean;
    bonusInfo?: IPlayerBonus;
  }>();

  const emit = defineEmits(['confirm']);
  const { closeModal } = useModalStore();
</script>

<style src="~/assets/styles/components/modal/cancel-lottery.scss" lang="scss" />
