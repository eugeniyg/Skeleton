<template>
  <vue-final-modal
    v-model="modals.resetPass"
    @click="closeModal('resetPass')"
    esc-to-close
  >
    <div class="modal-reset-pass" @click.stop>
      <div class="scroll">
        <div class="header">
          <button-modal-close @close="closeModal('resetPass')"/>
          <div class="title">Reset account <br> password</div>
        </div>
        <form-reset-pass/>
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
