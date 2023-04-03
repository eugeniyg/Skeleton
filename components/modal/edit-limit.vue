<template>
  <vue-final-modal
    v-model="modals.editLimit"
    class="modal-edit-limit"
    :clickToClose="false"
    @clickOutside="closeModal('editLimit')"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('editLimit')"/>
        <div class="title">{{ editLimitTitle }}</div>
      </div>

      <form-input-number
        :is-required="false"
        currency="EUR"
        :min="0"
        v-model:value="state.amount"
        placeholder="0"
      />

      <div class="modal-edit-limit__info">
        <div class="modal-edit-limit__info-title">
          <atomic-icon id="warning"/>
          <div>{{ editLimitWarning }}</div>
        </div>

        <div class="modal-edit-limit__info-text">
          Email confirmation will be needed. The change will be applied in 24 hours.
        </div>
      </div>

      <div class="modal-edit-limit__actions">
        <button-base type="primary" size="md" @click="update">Update</button-base>
        <button-base type="secondary" size="md" @click="remove">Delete</button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import { storeToRefs } from 'pinia';

  const { closeModal } = useLayoutStore();
  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { showAlert } = useLayoutStore();

  const editLimitTitle = 'Edit daily deposit limit';
  const editLimitWarning = 'New limit sum is bigger than the previous one';

  const alertProps = {
    title: 'Limit update successfully',
    description: 'Please, check your email and follow the received confirmation link to activate limit change.',
    type: 'warning',
  };

  const state = reactive({
    amount: 0,
    currency: 'EUR',
  });

  const update = () => {
    closeModal('editLimit');
    showAlert(alertProps);
  };

  const remove = (limitId: string) => {
    console.log('remove', limitId);
  };
</script>

<style lang="scss">
.modal-edit-limit {
  @extend %modal-info;

  &__actions {
    display: grid;
    grid-row-gap: 8px;

    .btn-primary, .btn-secondary {
      width: 100%;
      margin: 0;
    }
  }

  .scroll {
    grid-row-gap: 24px;
  }

  &__info {
    display: grid;
    grid-row-gap: 4px;

    &-title {
      @include font($heading-1);
      color: var(--white);
      display: flex;
      grid-column-gap: 8px;

      div {
        display: flex;
        align-items: center;
      }

      .icon {
        --color: var(--yellow-500);
        --icon-size: 20px;
      }
    }

    &-text {
      @include font($body-1);
      color: var(--gray-400);
    }
  }
}
</style>
