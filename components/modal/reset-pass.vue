<template>
  <vue-final-modal
    class="modal-reset-pass"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('reset-pass')" />
        <div class="title">{{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}</div>
      </div>

      <form-reset-pass :current-locale-data="props.currentLocaleData" :default-locale-data="props.defaultLocaleData" />
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IModalsContent } from '~/types';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['reset']>;
    defaultLocaleData: Maybe<IModalsContent['reset']>;
  }>();

  const { closeModal } = useModalStore();
</script>

<style src="~/assets/styles/components/modal/reset-pass.scss" lang="scss" />
