<template>
  <vue-final-modal
    class="modal-error-deposit"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
    @click-outside="closeModal('deposit-error')"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('deposit-error')" />
        <div class="title">{{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}</div>
      </div>

      <atomic-image class="img" src="/img/error.svg" />
      <client-only>
        <p class="text" v-html="descriptionContent" />
      </client-only>

      <button-base type="primary" size="md" @click="tryAgain">
        {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'button') }}
      </button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import { VueFinalModal } from 'vue-final-modal';
  import DOMPurify from 'isomorphic-dompurify';
  import type { IModalsContent } from '~/types';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['depositError']>;
    defaultLocaleData: Maybe<IModalsContent['depositError']>;
  }>();

  const { getContent } = useProjectMethods();
  const { closeModal, openWalletModal } = useModalStore();

  const tryAgain = async (): Promise<void> => {
    await openWalletModal('deposit');
  };

  const descriptionContent = computed(() => {
    const contentText = getContent(props.currentLocaleData, props.defaultLocaleData, 'description');
    if (!contentText) return '';
    return DOMPurify.sanitize(marked.parse(contentText) as string, { FORBID_TAGS: ['style'] });
  });
</script>

<style src="~/assets/styles/components/modal/deposit-error.scss" lang="scss" />
