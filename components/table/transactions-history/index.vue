<template>
  <div
    class="tb-transactions-history"
    :class="{ 'tb-transactions-history__short': props.invoices?.length < 3 }"
  >
    <div class="row">
      <div v-for="(th, thIndex) in headTitles" :key="thIndex" class="th">{{ th }}</div>
    </div>

    <div v-for="invoice in props.invoices" :key="invoice.id" class="row">
      <div class="td">{{ getFormatDate(invoice.createdAt) }}</div>
      <div class="td">{{ getInvoiceTypeLabel(invoice.invoiceType) }}</div>
      <div class="td">------</div>

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
          <span>{{ transactionsContent.cancelPaymentButton }}</span>
        </button-base>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PropType } from '@vue/runtime-core';
  import { HistoryTransactionsInterface } from '~/types';

  const props = defineProps({
    invoices: {
      type: Array,
      default: () => [],
    },
    transactionsContent: {
      type: Object as PropType<HistoryTransactionsInterface>,
      required: true,
    },
  });

  const emit = defineEmits(['cancelPayment']);
  const coreStore = useCoreStore();
  const headTitles = Object.values(props.transactionsContent.tableColumns);
  const { getFormatDate } = useProjectMethods();

  const getInvoiceType = (type: number):string => {
    const findInvoiceType = coreStore.invoiceTypes.find((storeType) => storeType.id === type);
    return findInvoiceType.name;
  };

  const getInvoiceTypeLabel = (type: number):string => {
    const typeName = getInvoiceType(type);
    return props.transactionsContent.typeFilter.options[typeName] || '';
  };

  const getInvoiceStatus = (status: number):string => {
    const findInvoiceStatus = coreStore.invoiceStatuses.find((storeStatus) => storeStatus.id === status);
    return findInvoiceStatus.name;
  };

  const getInvoiceStatusLabel = (status: number):string => {
    const statusName = getInvoiceStatus(status);
    return props.transactionsContent.statusFilter.options[statusName] || '';
  };
</script>

<style lang="scss" src="./style.scss"/>
