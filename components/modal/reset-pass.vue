<template>
  <vue-final-modal
    v-model="modals.resetPass"
    class="modal-reset-pass"
    :clickToClose="false"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('resetPass')"/>
        <div class="title">{{ resetContent?.title }}</div>
      </div>

      <form-reset-pass />
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';
  import { ResetInterface } from '~/types';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const { popupsData } = useGlobalStore();
  const resetContent: ResetInterface|undefined = popupsData?.reset;
</script>

<style lang="scss">
.modal-reset-pass {
  @extend %modal-info;

  .text {
    @include font($body-2);
    color: var(--gray-300);
  }
}
</style>
