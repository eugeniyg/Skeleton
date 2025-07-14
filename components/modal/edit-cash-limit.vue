<template>
  <vue-final-modal
    class="modal-edit-limit"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
    @click-outside="closeModal('edit-cash-limit')"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('edit-cash-limit')" />
        <div class="title">{{ label }}</div>
      </div>

      <form-input-number
        v-model:value="state.amount"
        :is-required="false"
        :currency="state.currency"
        :min="0"
        :max="1000000"
        :default-value="0"
        label=""
        name="edit-limit-currency"
        placeholder="0"
      />

      <div v-if="isLargeAmount" class="modal-edit-limit__info">
        <div class="modal-edit-limit__info-title">
          <atomic-icon id="warning" />
          <div>{{ getContent(props.currentLocaleData, props.defaultLocaleData, 'greaterAmountTitle') }}</div>
        </div>
        <div class="modal-edit-limit__info-text">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'hint') }}
        </div>
      </div>

      <div class="modal-edit-limit__actions">
        <button-base type="primary" size="md" :is-disabled="isDisableUpdate" @click="update">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'actions.updateButtonLabel') }}
        </button-base>
        <button-base type="secondary" size="md" @click="remove">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'actions.deleteButtonLabel') }}
        </button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IModalsContent } from '~/types';

  const props = defineProps<{
    limitId?: string;
    period?: string;
    definition?: number;
    amount?: number;
    currency?: string;
    currentLocaleData: Maybe<IModalsContent['editCashLimit']>;
    defaultLocaleData: Maybe<IModalsContent['editCashLimit']>;
  }>();

  const { getLimits } = useLimitsStore();
  const { showAlert } = useLayoutStore();
  const { deletePlayerLimit, updatePlayerLimit } = useCoreProfileApi();
  const { formatBalance, getMainBalanceFormat, getContent } = useProjectMethods();
  const globalStore = useGlobalStore();
  const { alertsData, defaultLocaleAlertsData } = storeToRefs(globalStore);
  const { closeModal } = useModalStore();

  const formattedBalance = formatBalance(props.currency, props.amount);

  const state = reactive<{
    prevAmount: number | undefined;
    amount: string;
    currency: string;
  }>({
    prevAmount: formattedBalance.amount,
    amount: String(formattedBalance.amount),
    currency: formattedBalance.currency,
  });

  const label = computed(() => {
    const labels = getContent(props.currentLocaleData, props.defaultLocaleData, 'popupLabel');
    if (!labels) return '';
    return labels[`edit_${props.period}_${props.definition}`];
  });

  const isDisableUpdate = computed(() => Number(state.prevAmount) === Number(state.amount) || !Number(state.amount));

  const isLargeAmount = computed(() => Number(state.amount) > Number(state.prevAmount));

  const update = async () => {
    await closeModal('edit-cash-limit');

    const formattedMainBalance = getMainBalanceFormat(state.currency, Number(state.amount));

    await updatePlayerLimit({
      limitId: props.limitId as string,
      amount: formattedMainBalance.amount,
    });
    await getLimits();

    if (isLargeAmount.value) {
      showAlert(
        alertsData.value?.limit?.cashLimitEditLargeAmount ||
          defaultLocaleAlertsData.value?.limit?.cashLimitEditLargeAmount
      );
    } else {
      showAlert(
        alertsData.value?.limit?.cashLimitEditSmallerAmount ||
          defaultLocaleAlertsData.value?.limit?.cashLimitEditSmallerAmount
      );
    }
  };

  const remove = async () => {
    await closeModal('edit-cash-limit');
    await deletePlayerLimit(props.limitId as string);
    await getLimits();

    showAlert(alertsData.value?.limit?.cashLimitCancel || defaultLocaleAlertsData.value?.limit?.cashLimitCancel);
  };
</script>

<style src="~/assets/styles/components/modal/edit-cash-limit.scss" lang="scss" />
