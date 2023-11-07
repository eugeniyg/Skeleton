<template>
  <div
    class="tb-transactions-history"
    :class="{ 'tb-transactions-history__short': props.invoices?.length < 3 }"
  >
    <div class="row">
      <div v-for="(th, thIndex) in headTitles" :key="thIndex" class="th">{{ th }}</div>
    </div>

    <div v-for="invoice in props.invoices" :key="invoice.id" class="row td-row">
      <div class="td">{{ dayjs(invoice.createdAt).format('DD.MM.YYYY, HH:mm') }}</div>
      <div class="td">{{ getInvoiceTypeLabel(invoice.invoiceType) }}</div>
      <div class="td">{{ invoice.paymentMethod }}</div>

      <div class="td">
        <atomic-row-status :variant="getInvoiceStatus(invoice.status)">
          {{ getInvoiceStatusLabel(invoice.status) }}
        </atomic-row-status>
      </div>

      <div class="td">{{ invoice.amount }} {{ invoice.currency }}</div>

      <div class="actions">
        <button-base
          v-if="invoice.publicData?.securityCode && !showCodes.includes(invoice.publicData.securityCode)"
          class="btn-get-code"
          type="primary"
          size="sm"
          @click="showCodes.push(invoice.publicData.securityCode)"
        >
          <atomic-icon id="security-code"/>
          <span>{{ props.transactionsContent.securityCode.getCodeButton }}</span>
        </button-base>

        <button-base
          v-if="getInvoiceStatus(invoice.status) === 'pending' && getInvoiceType(invoice.invoiceType) === 'withdrawal'"
          class="btn-cancel-payment"
          type="secondary"
          size="sm"
          @click.once="emit('cancelPayment', invoice.id)"
        >
          <atomic-icon id="trash"/>
          <span>{{ props.transactionsContent.cancelPaymentButton }}</span>
        </button-base>
      </div>

      <div
        v-if="invoice.publicData?.securityCode && showCodes.includes(invoice.publicData.securityCode)"
        class="security-code"
      >
        <atomic-copy-field
          :label="props.transactionsContent.securityCode.codeLabel"
          :value="invoice.publicData.securityCode"
          :tooltip="props.transactionsContent.securityCode.codeTooltip"
        />

        <atomic-copy-field
          :label="props.transactionsContent.securityCode.clientLabel"
          :value="invoice.publicData.clientId"
          :tooltip="props.transactionsContent.securityCode.clientTooltip"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ITransactionsHistory } from '~/types';
  import type { IInvoice } from '@skeleton/core/types';

  const props = defineProps<{
    invoices: IInvoice[];
    transactionsContent: ITransactionsHistory
  }>();

  const emit = defineEmits(['cancelPayment']);
  const headTitles = Object.values(props.transactionsContent.tableColumns);
  const globalStore = useGlobalStore();
  const dayjs = useDayjs();

  const getInvoiceType = (type: number):string => {
    const findInvoiceType = globalStore.invoiceTypes.find((storeType) => storeType.id === type);
    return findInvoiceType?.name || '';
  };

  const getInvoiceTypeLabel = (type: number):string => {
    const typeName = getInvoiceType(type);
    return props.transactionsContent.typeFilter.options[typeName] || '';
  };

  const getInvoiceStatus = (status: number):string => {
    const findInvoiceStatus = globalStore.invoiceStatuses.find((storeStatus) => storeStatus.id === status);
    return findInvoiceStatus?.name || '';
  };

  const getInvoiceStatusLabel = (status: number):string => {
    const statusName = getInvoiceStatus(status);
    return props.transactionsContent.statusFilter.options[statusName] || '';
  };

  // Get code
  const showCodes = ref<string[]>([]);
</script>

<style src="~/assets/styles/components/table/transactions-history.scss" lang="scss" />

