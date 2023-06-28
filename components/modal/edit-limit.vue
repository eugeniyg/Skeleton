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
        <div class="title">{{ label }}</div>
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

  const props = defineProps<{
    limitId?: string,
    period?: string,
    definition?: number,
    amount?: number,
    currency? : string,
  }>();

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

  const formattedBalance = formatBalance(props.currency, props.amount);

  const state = reactive<{
    prevAmount: number|undefined,
    amount: number,
    currency: string,
  }>({
    prevAmount: formattedBalance.amount,
    amount: formattedBalance.amount,
    currency: formattedBalance.currency,
  });

  const label = computed(() => {
    const labels = getContent(popupsData.value, defaultLocalePopupsData.value, 'limitsPopups.editCashLimit.popupLabel');
    if (!labels) return '';
    return labels[`edit_${props.period}_${props.definition}`];
  });

  const isDisableUpdate = computed(() => Number(state.prevAmount) === Number(state.amount) || !state.amount);

  const isLargeAmount = computed(() => Number(state.amount) > Number(state.prevAmount));

  const update = async () => {
    closeModal('editLimit');

    const formattedMainBalance = getMainBalanceFormat(state.currency, state.amount);

    await updatePlayerLimit({
      limitId: props.limitId,
      amount: formattedMainBalance.amount,
    });
    await getLimits();

    if (isLargeAmount.value) {
      showAlert(alertsData.value?.cashLimitEditLargeAmount || defaultLocaleAlertsData.value?.cashLimitEditLargeAmount);
    } else {
      showAlert(alertsData.value?.cashLimitEditSmallerAmount || defaultLocaleAlertsData.value?.cashLimitEditSmallerAmount);
    }
  };

  const remove = async () => {
    closeModal('editLimit');
    await deletePlayerLimit(props.limitId as string);
    await getLimits();

    showAlert(alertsData.value?.cashLimitCancel || defaultLocaleAlertsData.value?.cashLimitCancel);
  };
</script>

<style src="~/assets/styles/components/modal/edit-limit.scss" lang="scss" />
