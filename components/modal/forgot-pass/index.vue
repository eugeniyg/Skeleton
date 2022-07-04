<template>
  <vue-final-modal
    v-model="modals.forgotPass"
    @click="closeModal('forgotPass')"
    esc-to-close
  >
    <div class="modal-forgot-pass" @click.stop>
      <div class="scroll">
        <div class="header">
          <button-modal-close @close="closeModal('forgotPass')" />
          <div class="title">Forgot password?</div>
        </div>
        <p class="text">
          Enter your email address and we will send you a password reset link.
        </p>
        <form-forgot-pass />
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

<style lang="scss" src="./style.scss" />
