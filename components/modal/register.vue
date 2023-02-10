<template>
  <vue-final-modal
    v-model="modals.register"
    class="modal-register"
    displayDirective="show"
    @closed="closedEvent"
    :clickToClose="false"
  >
    <div class="container">
      <div class="slot">
        <atomic-promo/>
      </div>

      <div class="scroll">
        <div class="header">
          <button-modal-close @close="openCancelModal"/>
          <div class="title">{{ registrationContent?.title }}</div>
        </div>

        <form-join
          v-if="registrationFields.length"
          :registrationFields="registrationFields"
          :key="formKey"
        />
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { FieldInterface } from '@platform/frontend-core/dist/module';
  import { VueFinalModal } from 'vue-final-modal';
  import { RegistrationInterface } from '~/types';

  const formKey = ref<number>(0);
  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal, showModal } = layoutStore;
  const { popupsData } = useGlobalStore();
  const registrationContent: RegistrationInterface|undefined = popupsData?.registration;

  const openCancelModal = () => {
    closeModal('register');
    showModal('registerCancel');
  };

  const closedEvent = ():void => {
    if (!modals.value.registerCancel) formKey.value += 1;
  };

  watch(() => modals.value.registerCancel, (newValue: boolean) => {
    if (!newValue && !modals.value.register) formKey.value += 1;
  });

  const registrationFields = ref<FieldInterface[]>([]);
  const { getRegistrationFields } = useCoreAuthApi();
  onMounted(async () => {
    const fieldsResponse = await getRegistrationFields();
    registrationFields.value = fieldsResponse;
  });
</script>

<style lang="scss">
.modal-register {
  .container {
    display: flex;
    overflow: hidden;
    flex-direction: column;
    max-height: 100%;
    background-color: var(--gray-900);

    @include media(xs) {
      border-radius: 12px;
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
    padding: 4px 16px 24px 24px;
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
        margin-left: rem(32px);
      }
    }

    @include media(md) {
      width: rem(400px);
      padding: 20px 16px 24px 32px;
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

  .btn-modal-close {
    transform: translate(0, 0);
    --right: auto;
    --top: 4px;
    --bg: var(--gray-800);

    .icon {
      &:first-of-type {
        --visibility: visible;
      }

      &:last-of-type {
        --visibility: hidden;
      }

      @include media(xs) {
        &:first-of-type {
          --visibility: hidden;
        }

        &:last-of-type {
          --visibility: visible;
        }
      }
    }

    @include media(xs) {
      --top: #{rem(-4px)};
      --right: #{rem(-14px)};
      --bg: transparent;
    }

    @include media(md) {
      --top: #{rem(-16px)};
      --right: #{rem(-14px)};
    }
  }
}
</style>
