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
        <div class="title">
          {{ getContent(popupsData, defaultLocalePopupsData, 'limitsPopups.editCashLimit.label') }}
        </div>
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
          <div>{{ getContent(popupsData, defaultLocalePopupsData, 'limitsPopups.editCashLimit.greaterAmountTitle') }}</div>
        </div>
        <div class="modal-edit-limit__info-text">
          {{ getContent(popupsData, defaultLocalePopupsData, 'limitsPopups.editCashLimit.hint') }}
        </div>
      </div>

      <div class="modal-edit-limit__actions">
        <button-base
          type="primary"
          size="md"
          @click="update"
          :is-disabled="isDisableUpdate"
        >
          {{ getContent(popupsData, defaultLocalePopupsData, 'limitsPopups.editCashLimit.updateButtonLabel') }}
        </button-base>
        <button-base type="secondary" size="md" @click="remove">
          {{ getContent(popupsData, defaultLocalePopupsData, 'limitsPopups.editCashLimit.deleteButtonLabel') }}
        </button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import { storeToRefs } from 'pinia';
  import { AlertsListInterface } from '~/types';

  interface PropsInterface {
    limitId?: string,
    period?: string,
    amount?: number,
    currency? : string,
  }

  const props = defineProps<PropsInterface>();
  const emit = defineEmits(['update-limits']);

  const limitsStore = useLimitsStore();
  const { closeModal } = useLimitsStore();
  const { modals } = storeToRefs(limitsStore);
  const { showAlert } = useLayoutStore();
  const { deletePlayerLimit, updatePlayerLimit } = useCoreProfileApi();
  const { formatBalance, getMainBalanceFormat, getContent } = useProjectMethods();
  const globalStore = useGlobalStore();
  const { popupsData, defaultLocalePopupsData } = storeToRefs(globalStore);

  // const alertProps = {
  //   title: 'Limit update successfully',
  //   description: 'Please, check your email and follow the received confirmation link to activate limit change.',
  //   type: 'warning',
  // };

  const alertProps = ref<{
    type: string,
    title: string,
    description?: string}
  >();

  interface StateInterface {
    prevAmount?: string|number,
    limitId?: string,
    amount?: string|number,
    currency?: string,
  }

  const formattedBalance = formatBalance(props.currency, props.amount);

  const state = reactive<StateInterface>({
    prevAmount: formattedBalance.amount,
    amount: formattedBalance.amount,
    currency: formattedBalance.currency,
    limitId: props.limitId,
  });

  const isDisableUpdate = computed(() => Number(state.prevAmount) === Number(state.amount) || state.amount === '');

  const isGreaterPrev = computed(() => Number(state.amount) > Number(state.prevAmount));

  const update = async () => {
    closeModal('editLimit');
    const formattedMainBalance = getMainBalanceFormat(state.currency, state.amount);
    await updatePlayerLimit({
      limitId: state.limitId,
      amount: formattedMainBalance.amount,
    });
    emit('update-limits');

    if (isGreaterPrev.value) {
      alertProps.value = {
        title: 'Limit update successfully',
        description: 'Please, check your email and follow the received confirmation link to activate limit change.',
        type: 'warning',
      };
    } else {
      alertProps.value = {
        title: 'Limit update successfully',
        type: 'success',
      };
    }
  };

  const remove = async () => {
    closeModal('editLimit');
    await deletePlayerLimit(state.limitId);
    emit('update-limits');
    // showAlert(alertProps);
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
