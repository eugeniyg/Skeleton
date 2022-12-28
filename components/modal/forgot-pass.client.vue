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

<style lang="scss">
.modal-forgot-pass {
  @extend %modal-info;

  .text {
    @include font($body-2);
    color: var(--gray-300);
  }

  &__close,
  &__previous {
    @extend %skip-btn;
    width: rem(32px);
    height: rem(32px);
    position: var(--position, absolute);
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background-color: var(--bg, var(--gray-800));
    cursor: pointer;
    --bg: transparent;

    @include use-hover {
      &:hover {
        transition: background-color .2s ease-in-out;
        --bg: var(--gray-800);

        .icon {
          --color: var(--yellow-500);
        }
      }
    }

    .icon {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      margin: auto;
      --icon-size: 24px;
      --color: var(--gray-400);
    }
  }

  &__previous {
    --position: relative;
  }

  &__close {
    top: rem(-24px);
    right: rem(-16px);
  }
}
</style>
