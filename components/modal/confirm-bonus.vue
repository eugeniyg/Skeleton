<template>
  <vue-final-modal
    v-model="modals.confirmBonus"
    class="modal-confirm-bonus"
    :clickToClose="false"
    @clickOutside="closeModal('confirmBonus')"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('confirmBonus')"/>
        <div class="title">Confirm bonus update</div>
      </div>

      <p class="text"> The status of the currently active bonus will change to Cancelled. Are you sure you want to activate this bonus?</p>

      <div class="actions">
        <button-base type="primary" size="md" @click="activateBonus">Yes</button-base>
        <button-base type="secondary" size="md" @click="closeModal('confirmBonus')">No</button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal, showAlert } = layoutStore;

  const activateBonus = () => {
    closeModal('confirmBonus');
    const alertProps = {
      autoHide: true,
      type: 'done',
      title: 'You have succsfuly activated the bonus',
    };
    setTimeout(() => {
      showAlert(alertProps);
    }, 1000);
  };
</script>

<style lang="scss">
.modal-confirm-bonus {
  @extend %modal-info;

  .vfm__content {
    --content-gap: #{rem(24px)};
  }

  .btn-primary {
    --width: 100%;
  }

  .btn-secondary {
    --width: 100%;
  }

  .text {
    color: var(--gray-300);
    @include upd-font($body-2);
  }

  .actions {
    display: grid;
    grid-gap: rem(8px);
  }
}
</style>
