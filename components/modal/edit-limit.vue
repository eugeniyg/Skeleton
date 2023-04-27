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
        :currency="state.currency"
        :min="0"
        :default-value="0"
        label=""
        name="edit-limit-currency"
        v-model:value="state.amount"
        placeholder="0"
      />

      <div class="modal-edit-limit__info" v-if="isGreaterPrev">
        <div class="modal-edit-limit__info-title">
          <atomic-icon id="warning"/>
          <div>{{ editLimitWarning }}</div>
        </div>
        <div class="modal-edit-limit__info-text">
          Email confirmation will be needed. The change will be applied in 24 hours.
        </div>
      </div>

      <div class="modal-edit-limit__actions">
        <button-base
          type="primary"
          size="md"
          @click="update"
          :is-disabled="isDisableUpdate"
        >
          Update
        </button-base>
        <button-base type="secondary" size="md" @click="remove">Delete</button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import { storeToRefs } from 'pinia';

  interface PropsInterface {
    limitId?: string,
    period?: string,
    amount?: number,
    currency? : string,
  }

  const props = defineProps<PropsInterface>();
  const emit = defineEmits(['update-limits']);

  const { closeModal } = useLayoutStore();
  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { showAlert } = useLayoutStore();
  const { deletePlayerLimit, updatePlayerLimit } = useCoreProfileApi();

  const editLimitTitle = 'Edit daily deposit limit';
  const editLimitWarning = 'New limit sum is bigger than the previous one';

  const alertProps = {
    title: 'Limit update successfully',
    description: 'Please, check your email and follow the received confirmation link to activate limit change.',
    type: 'warning',
  };

  interface StateInterface {
    prevAmount?: string|number,
    limitId?: string,
    period?: string,
    amount?: string|number,
    currency?: string,
  }

  const state = reactive<StateInterface>({
    prevAmount: props.amount,
    limitId: props.limitId,
    period: props.period,
    amount: props.amount,
    currency: props.currency,
  });

  const isDisableUpdate = computed(() => Number(state.prevAmount) === Number(state.amount) || state.amount === '');

  const isGreaterPrev = computed(() => Number(state.amount) > Number(state.prevAmount));

  const update = async () => {
    try {
      await updatePlayerLimit({
        period: props.period,
        limitId: state.limitId,
        amount: state.amount,
      });
      emit('update-limits');
      showAlert(alertProps);
    } catch (error: any) {
      if (error.response?.status === 422) {
        showAlert({
          title: error.data?.error?.message,
          type: 'error',
        });
      } else {
        showAlert({
          title: 'Something went wrong',
          type: 'error',
        });
      }
    } finally {
      closeModal('editLimit');
    }
  };

  const remove = async () => {
    try {
      await deletePlayerLimit(state.limitId);
      emit('update-limits');
      showAlert(alertProps);
    } catch (error: any) {
      if (error.response?.status === 422) {
        showAlert({
          title: error.data?.error?.message,
          type: 'error',
        });
      } else {
        showAlert({
          title: 'Something went wrong',
          type: 'error',
        });
      }
    } finally {
      closeModal('editLimit');
    }
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
