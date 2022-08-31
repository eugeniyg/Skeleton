<template>
  <vue-final-modal
    v-model="modals.error"
    @click="closeModal('error')"
    esc-to-close
  >
    <div class="modal-success-deposit" @click.stop>
      <div class="scroll">
        <div class="header">
          <button-modal-close @close="closeModal('error')"/>
          <div class="title">{{ errorContent?.title }}</div>
        </div>
        <img class="img" src="@/assets/svg/colored/error.svg" />
        <p class="text" v-html="marked.parse(errorContent?.description || '')" />
        <button-base type="primary" size="md" @click="tryAgain">{{ errorContent?.button }}</button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { marked } from 'marked';
  import { ErrorInterface } from '~/types';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal, openDepositModal } = layoutStore;
  const { popupsData } = useGlobalStore();
  const errorContent: ErrorInterface|undefined = popupsData?.error;

  const tryAgain = async ():Promise<void> => {
    await openDepositModal();
    closeModal('error');
  };
</script>

<style lang="scss" src="./style.scss"/>
