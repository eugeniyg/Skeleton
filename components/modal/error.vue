<template>
  <vue-final-modal
    v-model="modals.failing"
    class="modal-error-deposit"
    :clickToClose="false"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
    @clickOutside="closeModal('failing')"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('failing')"/>
        <div class="title">{{ getContent(popupsData, defaultLocalePopupsData, 'error.title') }}</div>
      </div>

      <atomic-image class="img" src="/img/error.svg" />
      <client-only>
        <p class="text" v-html="descriptionContent" />
      </client-only>

      <button-base type="primary" size="md" @click="tryAgain">
        {{ getContent(popupsData, defaultLocalePopupsData, 'error.button') }}
      </button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { marked } from 'marked';
  import { VueFinalModal } from 'vue-final-modal';
  import DOMPurify from "isomorphic-dompurify";

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal, openWalletModal } = layoutStore;
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const tryAgain = async ():Promise<void> => {
    await openWalletModal('deposit');
    closeModal('failing');
  };

  const descriptionContent = computed(() => {
    const contentText = getContent(popupsData, defaultLocalePopupsData, 'error.description');
    if (!contentText) return '';
    return DOMPurify.sanitize(marked.parse(contentText) as string, { FORBID_TAGS: ['style'] });
  })
</script>

<style src="~/assets/styles/components/modal/error.scss" lang="scss" />

