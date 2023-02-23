<template>
  <vue-final-modal
    v-model="modals.success"
    class="modal-success-deposit"
    :clickToClose="false"
    @clickOutside="closeModal('success')"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('success')"/>
        <div class="title">{{ successContent?.title }}</div>
      </div>

      <img class="img" src="@/assets/svg/colored/success.svg" />
      <client-only>
        <p class="text" v-html="marked.parse(successContent?.description || '')" />
      </client-only>

      <button-base
        type="primary"
        size="md"
        @click="closeModal('success')"
      >
        {{ successContent?.button }}
      </button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { marked } from 'marked';
  import { VueFinalModal } from 'vue-final-modal';
  import { SuccessInterface } from '~/types';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const { popupsData } = useGlobalStore();
  const successContent: Maybe<SuccessInterface> = popupsData?.success;
</script>

<style lang="scss">
.modal-success-deposit {
  @extend %modal-info;
}
</style>
