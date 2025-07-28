<template>
  <vue-final-modal
    class="modal-success-deposit"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
    @click-outside="closeHandle"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeHandle" />
        <div class="title">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}
        </div>
      </div>

      <atomic-image class="img" :src="image" />

      <p
        class="text"
        v-html="DOMPurify.sanitize(marked.parse(description || '') as string, { FORBID_TAGS: ['style'] })"
      />

      <button-base type="primary" size="md" @click="closeHandle">
        {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'button') }}
      </button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import { VueFinalModal } from 'vue-final-modal';
  import DOMPurify from 'isomorphic-dompurify';
  import type { ISuccessModal } from '~/types';

  const props = defineProps<{
    currentLocaleData: Maybe<ISuccessModal>;
    defaultLocaleData: Maybe<ISuccessModal>;
  }>();

  const modalStore = useModalStore();

  const description = computed(() => {
    return getContent(props.currentLocaleData, props.defaultLocaleData, 'description') || '';
  });

  const image = computed(() => {
    return getContent(props.currentLocaleData, props.defaultLocaleData, 'image') || '/img/success.svg';
  });

  const successComponentModals = ['deposit-success', 'deposit-pending', 'deposit-redirect'];
  const closeHandle = (): void => {
    successComponentModals.forEach(modalName => {
      if (modalStore.modals[modalName]?.options?.modelValue) modalStore.closeModal(modalName);
    });
  };
</script>

<style src="~/assets/styles/components/modal/success.scss" lang="scss" />
