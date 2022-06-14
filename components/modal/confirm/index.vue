<template>
  <vue-final-modal
    v-model="modals.confirm"
    @click="closeModal('confirm')"
    esc-to-close
  >
    <div class="modal-confirm" @click.stop>
      <div class="scroll">
        <div class="header">
          <button-modal-close @close="closeModal('confirm')"/>
        </div>

        <img class="img" src="@/assets/svg/colored/confirm.svg" />
        <p class="text"> Your account has been confirmed</p>
        <button-base type="primary" size="md">Confirm</button-base>
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

<style lang="scss" src="./style.scss"></style>
