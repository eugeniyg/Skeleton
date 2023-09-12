<template>
  <div
    class="tb-transactions-history"
    :class="{ 'tb-transactions-history__short': props.invoices?.length < 3 }"
  >
    <div class="row">
      <div v-for="(th, thIndex) in headTitles" :key="thIndex" class="th">{{ th }}</div>
    </div>

    <div v-for="invoice in props.invoices" :key="invoice.id" class="row">
      <div class="td">{{ dayjs(invoice.createdAt).format('DD.MM.YYYY, HH:mm') }}</div>
      <div class="td">{{ getInvoiceTypeLabel(invoice.invoiceType) }}</div>
      <div class="td">{{ invoice.paymentMethod }}</div>

      <div class="td">
        <atomic-row-status :variant="getInvoiceStatus(invoice.status)">
          {{ getInvoiceStatusLabel(invoice.status) }}
        </atomic-row-status>
      </div>

      <div class="td">{{ invoice.amount }} {{ invoice.currency }}</div>

      <div class="actions" v-if="getInvoiceStatus(invoice.status) === 'pending' && getInvoiceType(invoice.invoiceType) === 'withdrawal'">
        <button-base
          class="btn-cancel-payment"
          type="secondary"
          size="sm"
          @click.once="emit('cancelPayment', invoice.id)"
        >
          <atomic-icon id="trash"/>
          <span>{{ props.transactionsContent.cancelPaymentButton }}</span>
        </button-base>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PropType } from '@vue/runtime-core';
  import { ITransactionsHistory } from '~/types';

  const props = defineProps({
    invoices: {
      type: Array,
      default: () => [],
    },
    transactionsContent: {
      type: Object as PropType<ITransactionsHistory>,
      required: true,
    },
  });

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
</script>

<style src="~/assets/styles/components/table/transactions-history.scss" lang="scss" />

