<template>
  <vue-final-modal
    v-model="modals.successDeposit"
    @click="closeModal('successDeposit')"
    esc-to-close
  >
    <div class="modal-success-deposit" @click.stop>
      <div class="scroll">
        <div class="header">
          <button-modal-close @close="closeModal('successDeposit')"/>
          <div class="title">Success</div>
        </div>
        <img class="img" src="@/assets/svg/colored/success.svg" />
        <p class="text"> Your deposit is successful! Money is already <br> on your balance.</p>
        <button-base type="primary" size="md">Done</button-base>
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

<style lang="scss" src="./style.scss"/>
