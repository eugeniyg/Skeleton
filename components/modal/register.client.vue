<template>
  <vue-final-modal
    v-model="modals.register"
    @beforeOpen="showForm = true"
    @closed="showForm = false"
    esc-to-close
  >
    <div class="modal-register">
      <div class="container">
        <div class="slot">
          <atomic-promo/>
        </div>

        <div class="scroll">
          <div class="header">
            <button-modal-close @close="closeModal('register')"/>
            <div class="title">{{ registrationContent?.title }}</div>
          </div>
          <form-join v-if="showForm"/>
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { RegistrationInterface } from '~/types';

  const showForm = ref<boolean>(false);
  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const { popupsData } = useGlobalStore();
  const registrationContent: RegistrationInterface|undefined = popupsData?.registration;
</script>

<style lang="scss">
.modal-register {
  height: 100%;
  display: flex;
  overflow: hidden;
  align-items: center;

  .container {
    display: flex;
    overflow: hidden;
    flex-direction: column;
    max-height: 100%;
    background-color: var(--gray-900);

    @include media(xs) {
      border-radius: rem(16px);
    }

    @include media(md) {
      flex-direction: row;
    }
  }

  .slot {
    @include media(md) {
      width: rem(400px);
      margin: #{rem(-4px)} 0 #{rem(-4px)} #{rem(-4px)};
    }
  }

  .scroll {
    display: flex;
    flex-direction: column;
    max-height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 16px 16px 24px 24px;
    border-top: 12px solid var(--gray-900);
    border-right: 8px solid var(--gray-900);
    border-bottom: 12px solid var(--gray-900);
    @extend %scrollbar;

    .header {
      display: flex;
      align-items: center;
      margin-bottom: rem(24px);
      grid-column-gap: rem(8px);
      width: 100%;
      position: relative;

      .title {
        @include font($heading-6);
        color: var(--white);
        text-align: var(--text-align, center);
        flex-grow: 1;
      }
    }

    @include media(md) {
      width: rem(400px);
      padding: 16px 16px 24px 32px;
    }
  }

  .dropdown:nth-of-type(1) {
    max-width: rem(98px);
    margin-left: auto;
  }

  .dropdown:nth-of-type(2) {
    max-width: calc(100% - #{rem(16px)} - #{rem(98px)});
    margin-top: rem(-88px);
  }
}
</style>
