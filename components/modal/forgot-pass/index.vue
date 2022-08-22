<template>
  <vue-final-modal
    v-model="modals.forgotPass"
    @beforeOpen="formKey++"
    esc-to-close
  >
    <div class="modal-forgot-pass">
      <div class="scroll">
        <div class="header">
          <button class="modal-forgot-pass__previous" @click.prevent="returnLoginModal">
            <atomic-icon id="ui-arrow_previous"/>
          </button>
          <div class="title">Forgot password?</div>
          <button class="modal-forgot-pass__close" @click.prevent="closeModal('forgotPass')">
            <atomic-icon id="ui-close"/>
          </button>
        </div>

        <p class="text">
          Enter your email address and we will send you a password reset link.
        </p>
        <form-forgot-pass :key="formKey" />
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal, showModal } = layoutStore;
  const formKey = ref<number>(0);

  const returnLoginModal = () => {
    showModal('signIn');
  };
</script>

<style lang="scss" src="./style.scss" />
