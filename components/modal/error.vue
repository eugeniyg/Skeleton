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
        <div class="title">{{ errorContent?.title }}</div>
      </div>

      <img class="img" src="@/assets/svg/colored/error.svg" />
      <client-only>
        <p class="text" v-html="marked.parse(errorContent?.description || '')" />
      </client-only>

      <button-base type="primary" size="md" @click="tryAgain">{{ errorContent?.button }}</button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { marked } from 'marked';
  import { VueFinalModal } from 'vue-final-modal';
  import { ErrorInterface } from '~/types';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal, openDepositModal } = layoutStore;
  const { popupsData } = useGlobalStore();
  const errorContent: Maybe<ErrorInterface> = popupsData?.error;

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
