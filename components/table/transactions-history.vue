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
  const headTitles = Object.values(props.transactionsContent.tableColumns);
  const globalStore = useGlobalStore();
  const { getFormatDate } = useProjectMethods();

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

<style lang="scss">
.tb-transactions-history {
  @extend %tb;
  @extend %scrollbar;
  overflow-x: auto;
  overscroll-behavior: auto;
  padding-bottom: rem(8px);

  .row {
    grid-template-columns:
      minmax(rem(100px), 1fr)
      minmax(rem(102px), 1fr)
      minmax(rem(154px), 1fr)
      minmax(rem(128px), 1fr)
      minmax(rem(158px), 1fr)
      minmax(rem(52px), 1fr);
  }

  .actions {
    grid-column: 1/7;
    grid-row: 2;
    padding-bottom: rem(16px);
    width: calc(100vw - #{rem(32px)});
    display: flex;
    justify-content: center;
    position: sticky;
    left: 0;
    right: 0;

    @include media(sm) {
      width: auto;
    }
  }

  &__short {
    margin-bottom: 32px;

    @include media(md) {
      margin-bottom: 100px;
    }
  }
}
</style>
