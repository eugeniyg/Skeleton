<template>
  <div class="tab-history__tb">
    <atomic-filters class="filters-transactions-history">
      <form-input-date
        :label="transactionsContent.dateLabel"
        :settings="dateConfig"
        @change="changeDate"
      />

      <form-input-dropdown
        :label="transactionsContent.typeFilter.label"
        v-model:value="filters.type"
        name="invoiceType"
        placeholder=""
        :options="typeOptions"
        @input="changeFilters"
      />

      <form-input-dropdown
        :label="transactionsContent.currencyLabel"
        v-model:value="filters.currency"
        name="invoiceCurrency"
        placeholder=""
        :options="currenciesOptions"
        @input="changeFilters"
      />

      <form-input-dropdown
        :label="transactionsContent.statusFilter.label"
        v-model:value="filters.status"
        name="invoiceStatus"
        placeholder=""
        :options="statusOptions"
        @input="changeFilters"
      />
    </atomic-filters>

    <table-transactions-history
      v-if="invoices.length"
      :invoices="invoices"
      @cancelPayment="cancelPayment"
      :transactionsContent="transactionsContent"
    />

    <atomic-pagination
      v-if="pageMeta?.totalPages > 1"
      @selectPage="changePage"
      v-bind="pageMeta"
    />

    <atomic-empty
      v-if="!invoices.length && !loading"
      variant="transactions"
      :title="transactionsContent.empty.title"
      :subTitle="transactionsContent.empty.description"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import {
    InvoiceInterface,
    InvoicesRequestOptionsInterface,
    PaginationMetaInterface,
  } from '@platform/frontend-core/dist/module';
  import { HistoryTransactionsInterface, HistoryTabInterface } from '@skeleton/types';

  const props = defineProps<{
    content: HistoryTabInterface
  }>();

  const transactionsContent:HistoryTransactionsInterface = props.content.transactions;
  const globalStore = useGlobalStore();
  const optionsDefaultValue = { value: transactionsContent.allFilterOption, code: 'all' };

  const typeOptions = computed(() => {
    const storeOptions = globalStore.invoiceTypes.map((item) => ({ value: transactionsContent.typeFilter.options[item.name], code: item.id }));
    return [optionsDefaultValue, ...storeOptions];
  });

  const statusOptions = computed(() => {
    const storeOptions = globalStore.invoiceStatuses.map((item) => ({ value: transactionsContent.statusFilter.options[item.name], code: item.id }));
    return [optionsDefaultValue, ...storeOptions];
  });

  const fieldsStore = useFieldsStore();
  const { selectOptions } = storeToRefs(fieldsStore);
  const currenciesOptions = computed(() => [optionsDefaultValue, ...selectOptions.value.currency]);

  const filters = reactive<{[key:string]:any}>({
    page: 1,
    perPage: 10,
    dateFrom: undefined,
    dateTo: undefined,
    type: 'all',
    currency: 'all',
    status: 'all',
  });

  const dateConfig = {
    mode: 'range',
    disable: [
      function (date:number) {
        return (date > Date.now());
      },
    ],
  };

  const invoices = ref<InvoiceInterface[]>([]);
  const pageMeta = ref<PaginationMetaInterface>();
  const { getPlayerInvoices, cancelInvoice } = useCoreWalletApi();
  const loading = ref<boolean>(true);
  const resolveInvoicesRequest = async ():Promise<void> => {
    loading.value = true;
    const requestOptions: InvoicesRequestOptionsInterface = {} as InvoicesRequestOptionsInterface;
    Object.keys(filters).forEach((param) => {
      if (filters[param] && filters[param] !== 'all') requestOptions[param] = filters[param];
    });
    const response = await getPlayerInvoices(requestOptions);
    invoices.value = response.data;
    pageMeta.value = response.meta;
    loading.value = false;
  };

  const changePage = (page: number):void => {
    if (loading.value) return;
    filters.page = page;
    window.scroll(0, 0);
    resolveInvoicesRequest();
  };

  const { showAlert } = useLayoutStore();
  const { alertsData, defaultLocaleAlertsData } = storeToRefs(globalStore);
  const cancelPayment = async (invoiceId: string):Promise<void> => {
    const response = await cancelInvoice(invoiceId);
    showAlert(alertsData.value?.userCanceledWithdrawal || defaultLocaleAlertsData.value?.userCanceledWithdrawal);

    const closedIndex = invoices.value.findIndex((invoice) => invoice.id === invoiceId);
    invoices.value[closedIndex] = response;
  };

  const changeFilters = ():void => {
    filters.page = 1;
    resolveInvoicesRequest();
  };

  const changeDate = (dates: string[]):void => {
    if (dates.length === 2 && (dates[0] !== filters.dateFrom || dates[1] !== filters.dateTo)) {
      [filters.dateFrom, filters.dateTo] = dates;
      resolveInvoicesRequest();
    } else if (dates[0] !== filters.dateFrom || dates[1] !== filters.dateTo) {
      filters.dateFrom = undefined;
      filters.dateTo = undefined;
      resolveInvoicesRequest();
    }
  };

  onMounted(() => { resolveInvoicesRequest(); });
</script>

<style src="~/assets/styles/components/tab/history/transactions.scss" lang="scss" />

