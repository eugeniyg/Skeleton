<template>
  <div class="tab-history__tb">
    <div class="tb-transactions-history">
      <div class="row">
        <div v-for="(th, thIndex) in headTitles" :key="thIndex" class="th">{{ th }}</div>
      </div>

      <div v-for="invoice in props.invoices" :key="invoice.id" class="row">
        <div class="td">{{ getFormatDate(invoice.createdAt) }}</div>
        <div class="td" style="text-transform: capitalize">{{ getInvoiceType(invoice.invoiceType) }}</div>
        <div class="td">------</div>

        <div class="td" style="text-transform: capitalize">
          <atomic-row-status :variant="getInvoiceStatus(invoice.status)">
            {{ getInvoiceStatus(invoice.status) }}
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
            <atomic-icon id="ui-trash"/>
            <span>Cancel payment</span>
          </button-base>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    invoices: {
      type: Array,
      default: () => [],
    },
  });

  const emit = defineEmits(['cancelPayment']);
  const coreStore = useCoreStore();
  const headTitles = ['Date', 'Type', 'Payment Method', 'Status', 'Sum'];
  const { getFormatDate } = useProjectMethods();

  const getInvoiceType = (type: number):string => {
    const findInvoiceType = coreStore.invoiceTypes.find((storeType) => storeType.id === type);
    return findInvoiceType.name || '';
  };

  const getInvoiceStatus = (status: number):string => {
    const findInvoiceStatus = coreStore.invoiceStatuses.find((storeStatus) => storeStatus.id === status);
    return findInvoiceStatus.name || '';
  };
</script>

<style lang="scss" src="./style.scss"/>
