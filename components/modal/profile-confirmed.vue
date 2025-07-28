<template>
  <vue-final-modal
    class="modal-confirm"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
    @click-outside="closeModal('profile-confirmed')"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('profile-confirmed')" />
      </div>

      <atomic-image class="img" src="/img/confirm.svg" />
      <p class="text">{{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}</p>

      <button-base type="primary" size="md" @click="closeModal('profile-confirmed')">
        {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'button') }}
      </button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IModalsContent } from '~/types';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['profileConfirmed']>;
    defaultLocaleData: Maybe<IModalsContent['profileConfirmed']>;
  }>();

  const { closeModal } = useModalStore();
</script>

<style src="~/assets/styles/components/modal/profile-confirmed.scss" lang="scss" />
