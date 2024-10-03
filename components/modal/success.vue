<template>
  <vue-final-modal
    v-model="modals.success"
    class="modal-success-deposit"
    :clickToClose="false"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
    @clickOutside="closeModal('success')"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('success')"/>
        <div class="title">{{ title }}</div>
      </div>

      <atomic-image class="img" src="/img/success.svg" />
      <client-only>
        <p class="text" v-html="DOMPurify.sanitize(marked.parse(description || '') as string, { FORBID_TAGS: ['style'] })" />
      </client-only>

      <button-base
        type="primary"
        size="md"
        @click="closeModal('success')"
      >
        {{ button }}
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
  const { modals, successModalType } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const title = computed(() => {
    if (successModalType.value === 'deposit') return getContent(popupsData, defaultLocalePopupsData, 'successDeposit.title');
    if (successModalType.value === 'deposit-pending') return getContent(popupsData, defaultLocalePopupsData, 'successDepositPending.title');
    return '';
  })

  const description = computed(() => {
    if (successModalType.value === 'deposit') return getContent(popupsData, defaultLocalePopupsData, 'successDeposit.description');
    if (successModalType.value === 'deposit-pending') return getContent(popupsData, defaultLocalePopupsData, 'successDepositPending.description');
    return '';
  })

  const button = computed(() => {
    if (successModalType.value === 'deposit') return getContent(popupsData, defaultLocalePopupsData, 'successDeposit.button');
    if (successModalType.value === 'deposit-pending') return getContent(popupsData, defaultLocalePopupsData, 'successDepositPending.button');
    return '';
  })
</script>

<style src="~/assets/styles/components/modal/success.scss" lang="scss" />

