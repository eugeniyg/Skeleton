<template>
  <vue-final-modal
    v-model="modals.confirm"
    @click="closeModal('confirm')"
    esc-to-close
  >
    <div class="modal-confirm" @click.stop>
      <div class="scroll">
        <div class="header">
          <button-modal-close @close="closeModal('confirm')"/>
        </div>

        <img class="img" src="@/assets/svg/colored/confirm.svg" />
        <p class="text">{{ confirmContent?.title }}</p>
        <button-base type="primary" size="md" @click="closeModal('confirm')">{{ confirmContent?.button }}</button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ConfirmInterface } from '~/types';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const { popupsData } = useGlobalStore();
  const confirmContent: ConfirmInterface|undefined = popupsData?.confirm;
</script>

<style lang="scss">
.modal-confirm {
  @extend %modal-info;
  margin: 0 rem(16px);

  .header {
    position: relative;
    padding-top: 0;
    grid-row-gap: 0;
  }

  .text {
    @include font($heading-5);
    text-align: center;
    color: var(--white);
    margin: 0 0;
  }

  .scroll {
    padding-top: rem(20px);
    border-radius: 16px;
  }

  .btn-primary {
    --width: 100%;
    margin: rem(8px) auto 0;
  }

  .btn-modal-close {
    position: absolute;
    transform: translate(0, -50%);
    --bg: var(--gray-900);
    --right: #{rem(-4px)};

    @include use-hover {
      &:hover {
        --bg: var(--gray-800);
      }
    }

    .icon {
      &:first-of-type {
        --visibility: hidden;
      }

      &:last-of-type {
        --visibility: visible;
        background: transparent;
      }
    }
  }
}
</style>
