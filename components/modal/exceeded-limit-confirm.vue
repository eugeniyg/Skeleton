<template>
  <vue-final-modal
    v-model="modals.exceededLimitConfirm"
    class="modal-edit-limit-confirm"
    :clickToClose="false"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('exceededLimitConfirm')"/>
        <div class="title">Edit your limits</div>
      </div>

      <div class="modal-edit-limit-confirm__text">
        Sorry, but you can't make deposits for now because you have active limits.
      </div>

    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import { storeToRefs } from 'pinia';

  const limitsStore = useLimitsStore();
  const { closeModal } = limitsStore;
  const { modals } = storeToRefs(limitsStore);
</script>

<style lang="scss">
.modal-edit-limit-confirm {
  @extend %modal-info;

  &__text {
    @include font($body-2);
    color: var(--gray-300)
  }

  .scroll {
    grid-row-gap: 24px;
  }
}

</style>
