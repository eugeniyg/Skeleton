<template>
  <vue-final-modal
    class="modal-max-bets"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('max-bets')" />
      </div>

      <atomic-image class="img" :src="getContent(props.currentLocaleData, props.defaultLocaleData, 'image')" />

      <div class="title">
        {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}
      </div>

      <p class="text">
        {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'description') }}
      </p>

      <div class="modal-max-bets__info">
        <atomic-icon id="warning" />

        <span class="modal-max-bets__info-label">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'maxBetLabel') }}:
        </span>

        <span class="modal-max-bets__info-value">
          {{ props.maxBet }}
        </span>
      </div>

      <div class="actions">
        <button-base type="primary" size="md" @click="closeModal('max-bets')">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'confirmButton') }}
        </button-base>

        <button-base type="ghost" size="xs" @click="handleCancel">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'cancelButton') }}
        </button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IModalsContent } from '~/types';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['maxBet']>;
    defaultLocaleData: Maybe<IModalsContent['maxBet']>;
    maxBet: string;
  }>();

  const { closeModal } = useModalStore();
  const router = useRouter();

  const handleCancel = async (): Promise<void> => {
    await router.push(localizePath('/profile/bonuses'));
    await closeModal('max-bets');
  };
</script>

<style src="~/assets/styles/components/modal/max-bets.scss" lang="scss" />
