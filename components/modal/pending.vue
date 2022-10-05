<template>
  <vue-final-modal
    v-model="modals.pending"
    @click="closeModal('pending')"
    esc-to-close
  >
    <div class="modal-pending" @click.stop>
      <div class="scroll">
        <div class="header">
          <button-modal-close @close="closeModal('pending')"/>
          <div class="title">Pending</div>
        </div>
        <img class="img" src="@/assets/svg/colored/pending.svg" />
        <p class="text">Your deposit is being processed. You can check its status in a short while.</p>
        <button-base type="primary" size="md">Ok</button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
</script>

<style lang="scss">
.modal-pending {
  @extend %modal-info;
}
</style>
