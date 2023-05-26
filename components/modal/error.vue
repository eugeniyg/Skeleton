<template>
  <vue-final-modal
    v-model="modals.error"
    class="modal-error-deposit"
    :clickToClose="false"
    @clickOutside="closeModal('error')"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('error')"/>
        <div class="title">{{ getContent(popupsData, defaultLocalePopupsData, 'error.title') }}</div>
      </div>

      <img class="img" src="/img/error.svg" />
      <client-only>
        <p class="text" v-html="marked.parse(getContent(popupsData, defaultLocalePopupsData, 'error.description') || '')" />
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

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal, openDepositModal } = layoutStore;
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const tryAgain = async ():Promise<void> => {
    await openDepositModal();
    closeModal('error');
  };
</script>

<style lang="scss">
.modal-error-deposit {
  @extend %modal-info;
}
</style>
