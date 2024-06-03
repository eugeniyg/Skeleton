<template>
  <vue-final-modal
    v-model="modals.success"
    class="modal-success-deposit"
    :clickToClose="false"
    @clickOutside="closeModal('success')"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('success')"/>
        <div class="title">{{ title }}</div>
      </div>

      <atomic-image class="img" src="/img/success.svg" />
      <client-only>
        <p class="text" v-html="marked.parse(description || '')" />
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

  const layoutStore = useLayoutStore();
  const { modals, successModalType } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const title = computed(() => {
    if (successModalType.value === 'deposit')
      return getContent(popupsData, defaultLocalePopupsData, 'successDeposit.title');
    else if (successModalType.value === 'deposit-pending')
      return getContent(popupsData, defaultLocalePopupsData, 'successDepositPending.title');
  })

  const description = computed(() => {
    if (successModalType.value === 'deposit')
      return getContent(popupsData, defaultLocalePopupsData, 'successDeposit.description');
    else if (successModalType.value === 'deposit-pending')
      return getContent(popupsData, defaultLocalePopupsData, 'successDepositPending.description');
  })

  const button = computed(() => {
    if (successModalType.value === 'deposit')
      return getContent(popupsData, defaultLocalePopupsData, 'successDeposit.button');
    else if (successModalType.value === 'deposit-pending')
      return getContent(popupsData, defaultLocalePopupsData, 'successDepositPending.button');
  })
</script>

<style src="~/assets/styles/components/modal/success.scss" lang="scss" />

