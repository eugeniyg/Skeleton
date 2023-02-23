<template>
  <vue-final-modal
    v-model="modals.registerCancel"
    :clickToClose="false"
    @clickOutside="closeModal('registerCancel')"
    class="modal-register-cancel"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('registerCancel')"/>
        <h4 class="title">{{ registrationCancelContent?.title }}</h4>
      </div>

      <div class="bonus">
        <img :src="registrationCancelContent?.bonusImage" alt="">
        <div class="bonus-text" v-html="bonusContent" />
      </div>

      <div class="actions">
        <button-base
          type="primary"
          size="md"
          @click="showModal('register')"
        >
          {{ registrationCancelContent?.backButton }}
        </button-base>

        <button-base
          type="ghost"
          size="xs"
          @click="closeModal('registerCancel')"
        >
          {{ registrationCancelContent?.closeButton }}
        </button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';
  import { RegistrationCancelInterface } from '~/types';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { showModal, closeModal } = layoutStore;
  const { popupsData } = useGlobalStore();
  const registrationCancelContent: Maybe<RegistrationCancelInterface> = popupsData?.registrationCancel;

  const { replaceContent } = useCoreMethods();
  const bonusContent = registrationCancelContent?.bonusText ? replaceContent(registrationCancelContent?.bonusText, '*') : '';
</script>

<style lang="scss">
.modal-register-cancel {
  @extend %modal-info;

  .vfm__content {
    max-width: rem(440px);
  }

  .header {
    grid-row-gap: 0;

    .title {
      @include upd-font($heading-5);
      margin: 0;
      padding: 0 #{rem(16px)};
    }
  }

  .btn-primary {
    margin: 0 0 rem(8px);
  }

  .btn-ghost {
    --width: 100%;
  }

  .bonus {
    padding: rem(16px);
    background-color: var(--gray-800);
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.16);
    border-radius: 8px;
    grid-template-rows: none;
    grid-row-gap: 0;

    img {
      width: 48px;
      height: 48px;
      object-fit: contain;
    }
  }

  .bonus-text {
    @include font($heading-1);
    color: var(--white);

    span {
      color: var(--yellow-500);
    }
  }
}
</style>
