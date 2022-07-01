<template>
  <vue-final-modal
    v-model="modals.forgotPass"
    @click="closeModal('forgotPass')"
    esc-to-close
  >
    <div class="modal-forgot-pass" @click.stop>
      <div class="scroll">
        <div class="header">
          <button-modal-close @close="closeForgotPassModal" />
          <div class="title">Forgot your password?</div>
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
  const { closeModal, showModal } = layoutStore;

  const closeForgotPassModal = ():void => {
    closeModal('forgotPass');
    showModal('signIn');
  };
</script>

<style lang="scss" src="./style.scss" />
