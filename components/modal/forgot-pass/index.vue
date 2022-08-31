<template>
  <vue-final-modal
    v-model="modals.forgotPass"
    @beforeOpen="showForm = true"
    @closed="showForm = false"
    esc-to-close
  >
    <div class="modal-forgot-pass">
      <div class="scroll">
        <div class="header">
          <button class="modal-forgot-pass__previous" @click.prevent="returnLoginModal">
            <atomic-icon id="arrow_previous"/>
          </button>
          <div class="title">{{ forgotContent?.title }}</div>
          <button class="modal-forgot-pass__close" @click.prevent="closeModal('forgotPass')">
            <atomic-icon id="close"/>
          </button>
        </div>

        <p class="text">
          {{ forgotContent?.description }}
        </p>
        <form-forgot-pass v-if="showForm" />
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ForgotInterface } from '~/types';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal, showModal } = layoutStore;
  const showForm = ref<boolean>(false);

  const { popupsData } = useGlobalStore();
  const forgotContent: ForgotInterface|undefined = popupsData?.forgot;

  const returnLoginModal = () => {
    showModal('signIn');
  };
</script>

<style lang="scss" src="./style.scss" />
