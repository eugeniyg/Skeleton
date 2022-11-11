<template>
  <vue-final-modal
    v-model="modals.success"
    @click="closeModal('success')"
    esc-to-close
  >
    <div class="modal-success-deposit" @click.stop>
      <div class="scroll">
        <div class="header">
          <button-modal-close @close="closeModal('success')"/>
          <div class="title">{{ successContent?.title }}</div>
        </div>
        <img class="img" src="@/assets/svg/colored/success.svg" />
        <p class="text" v-html="marked.parse(successContent?.description || '')" />
        <button-base
          type="primary"
          size="md"
          @click="closeModal('success')"
        >
          {{ successContent?.button }}
        </button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { marked } from 'marked';
  import { SuccessInterface } from '~/types';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const { popupsData } = useGlobalStore();
  const successContent: SuccessInterface|undefined = popupsData?.success;
</script>

<style lang="scss">
.modal-success-deposit {
  @extend %modal-info;
}
</style>
