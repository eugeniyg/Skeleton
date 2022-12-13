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
          <h4 class="title">{{ registrationCancelContent?.title || 'Are you sure you want to cancel your registration ?' }}</h4>
        </div>
        <div class="bonus">
          <img :src="registrationCancelContent?.bonus?.icon || bonusIcon" alt="">
          <div
            class="bonus-text"
            v-html="registrationCancelContent?.bonus?.text ||
              'Sign-up takes only a minute and welcome you with up to <span>5 BTC + 300 FS</span>'"
          />
        </div>
        <div class="actions">
          <button-base type="primary" size="md" @click="showModal('register')">{{ registrationCancelContent?.backToSignUpButton || 'Back to Sign Up' }}</button-base>
          <button-base type="ghost" size="xs" @click="closeModal('registerCancel')">{{ registrationCancelContent?.closeButton || 'Close' }}</button-base>
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { RegistrationCancelInterface } from '~/types';
  import bonusIcon from '~/assets/svg/colored/icn-notification.svg';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { showModal, closeModal } = layoutStore;
  const { popupsData } = useGlobalStore();
  const registrationCancelContent: RegistrationCancelInterface|undefined = popupsData?.registrationCancel;
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
