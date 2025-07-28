<template>
  <vue-final-modal
    class="modal-cancel-deposit"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('cancel-deposit')" />

        <div class="title">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}
        </div>
      </div>

      <div
        v-if="modalContent"
        class="modal-cancel-deposit__content"
        v-html="DOMPurify.sanitize(marked.parse(modalContent) as string, { FORBID_TAGS: ['style'] })"
      />

      <div class="modal-cancel-deposit__actions">
        <button-base type="primary" size="md" @click="closeModal('cancel-deposit')">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'primaryButton') }}
        </button-base>

        <button-base type="secondary" size="md" @click="closeModal('cancel-deposit')">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'secondaryButton') }}
        </button-base>

        <button-base size="xs" type="ghost" @click="closeAllModals">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'confirm') }}
        </button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import { VueFinalModal } from 'vue-final-modal';
  import DOMPurify from 'isomorphic-dompurify';
  import type { IModalsContent } from '~/types';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['cancelDeposit']>;
    defaultLocaleData: Maybe<IModalsContent['cancelDeposit']>;
  }>();

  const { closeModal, closeAllModals } = useModalStore();
  const modalContent = getContent(props.currentLocaleData, props.defaultLocaleData, 'content');
</script>

<style src="~/assets/styles/components/modal/cancel-deposit.scss" lang="scss" />
