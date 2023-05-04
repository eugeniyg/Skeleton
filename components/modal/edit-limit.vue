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

      <div class="modal-edit-limit__info" v-if="isLargeAmount">
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

  interface PropsInterface {
    limitId?: string,
    period?: string,
    amount?: number,
    currency? : string,
  }

  const props = defineProps<PropsInterface>();

  const limitsStore = useLimitsStore();
  const { closeModal, getLimits } = useLimitsStore();
  const { modals } = storeToRefs(limitsStore);
  const { showAlert } = useLayoutStore();
  const { deletePlayerLimit, updatePlayerLimit } = useCoreProfileApi();
  const { formatBalance, getMainBalanceFormat, getContent } = useProjectMethods();
  const globalStore = useGlobalStore();
  const {
    alertsData,
    defaultLocaleAlertsData,
    popupsData,
    defaultLocalePopupsData,
  } = storeToRefs(globalStore);

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

  const isLargeAmount = computed(() => Number(state.amount) > Number(state.prevAmount));

  const update = async () => {
    closeModal('editLimit');

    const formattedMainBalance = getMainBalanceFormat(state.currency, state.amount);

    await updatePlayerLimit({
      limitId: state.limitId,
      amount: formattedMainBalance.amount,
    });
    await getLimits();

    if (isLargeAmount.value) {
      showAlert({
        title: getContent(alertsData.value, defaultLocaleAlertsData.value, 'cashLimitEditLargeAmount.title'),
        description: getContent(alertsData.value, defaultLocaleAlertsData.value, 'cashLimitEditLargeAmount.description'),
        type: getContent(alertsData.value, defaultLocaleAlertsData.value, 'cashLimitEditLargeAmount.type'),
      });
    } else {
      showAlert({
        title: getContent(alertsData.value, defaultLocaleAlertsData.value, 'cashLimitEditSmallerAmount.title'),
        type: getContent(alertsData.value, defaultLocaleAlertsData.value, 'cashLimitEditSmallerAmount.type'),
      });
    }
  };

  const remove = async () => {
    closeModal('editLimit');
    await deletePlayerLimit(state.limitId);
    await getLimits();

    showAlert({
      title: getContent(alertsData.value, defaultLocaleAlertsData.value, 'cashLimitCancel.title'),
      description: getContent(alertsData.value, defaultLocaleAlertsData.value, 'cashLimitCancel.description'),
      type: getContent(alertsData.value, defaultLocaleAlertsData.value, 'cashLimitCancel.type'),
    });
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
