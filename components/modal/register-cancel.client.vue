<template>
  <vue-final-modal
    v-model="modals.registerCancel"
    @click="closeModal('registerCancel')"
    esc-to-close
  >
    <div class="modal-register-cancel" @click.stop>
      <div class="scroll">
        <div class="header">
          <button-modal-close @close="closeModal('registerCancel')"/>
          <h4 class="title">{{ registrationCancelContent?.title }}</h4>
        </div>

        <div class="bonus">
          <img v-if="registrationCancelContent?.bonusImage" :src="registrationCancelContent.bonusImage" alt="">
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
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { RegistrationCancelInterface } from '~/types';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { showModal, closeModal } = layoutStore;
  const { popupsData } = useGlobalStore();
  const registrationCancelContent: RegistrationCancelInterface|undefined = popupsData?.registrationCancel;

  const { replaceContent } = useCoreMethods();
  const bonusContent = registrationCancelContent?.bonusText ? replaceContent(registrationCancelContent?.bonusText, '*') : '';
</script>

<style lang="scss">
.modal-register-cancel {
  @extend %modal-info;
  max-width: rem(440px);

  .header {
    grid-row-gap: 0;

    .title {
      @include upd-font($heading-5);
      margin: 0;
      padding: 0 #{rem(16px)};
    }
  }

  .scroll {
    grid-row-gap: rem(24px);
    padding: 0 #{rem(16px)} #{rem(20px)} #{rem(16px)};

    @include media(l) {
      padding: #{rem(8px)} #{rem(24px)} #{rem(24px)} #{rem(24px)};
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
  }

  .bonus-text {
    @include font($heading-1);
    color: var(--white);

    span {
      color: var(--yellow-500);
    }
  }

  .btn-modal-close {
    --right: 0;

    @include media(md) {
      --right: #{rem(-8px)};
    }
  }
}
</style>
