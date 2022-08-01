<template>
  <div>
    <atomic-filters class="filters-transactions-history">
      <form-input-date label="Date from / to:" :settings="dateConfig" @change="changeDate"/>

      <form-dropdown-base
        label="Type:"
        v-model:value="filters.type"
        name="invoiceType"
        placeholder=""
        :options="typeOptions"
        @input="changeFilters"
      />

      <form-dropdown-base
        label="Currency:"
        v-model:value="filters.currency"
        name="invoiceCurrency"
        placeholder=""
        :options="currenciesOptions"
        @input="changeFilters"
      />

      <form-dropdown-base
        label="Status:"
        v-model:value="filters.status"
        name="invoiceStatus"
        placeholder=""
        :options="statusOptions"
        @input="changeFilters"
      />
    </atomic-filters>

    <table-transactions-history v-if="invoices.length" :invoices="invoices" @cancelPayment="cancelPayment"/>

    <atomic-pagination
      v-if="pageMeta?.totalPages > 1"
      @selectPage="changePage"
      v-bind="pageMeta"
    />

    <atomic-empty v-if="!invoices.length" variant="transactions" sub-title="You don’t have any successful transactions yet."/>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import {
    InvoiceInterface,
    InvoicesRequestOptionsInterface,
    PaginationMetaInterface,
  } from '@platform/frontend-core/dist/module';

  const coreStore = useCoreStore();
  const optionsDefaultValue = { value: 'All', code: 'all' };

  const typeOptions = computed(() => {
    const storeOptions = coreStore.invoiceTypes.map((item) => ({ value: item.name.charAt(0).toUpperCase() + item.name.slice(1), code: item.id }));
    return [optionsDefaultValue, ...storeOptions];
  });

  const statusOptions = computed(() => {
    const storeOptions = coreStore.invoiceStatuses.map((item) => ({ value: item.name.charAt(0).toUpperCase() + item.name.slice(1), code: item.id }));
    return [optionsDefaultValue, ...storeOptions];
  });

  const fieldsStore = useFieldsStore();
  const { selectOptions } = storeToRefs(fieldsStore);
  const currenciesOptions = computed(() => [optionsDefaultValue, ...selectOptions.value.currency]);

  const filters = reactive({
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
      function (date) {
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
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    resolveInvoicesRequest();
  };

  const { showAlert } = useLayoutStore();
  const cancelPayment = async (invoiceId: string):Promise<void> => {
    const response = await cancelInvoice(invoiceId);
    showAlert({
      title: 'Success',
      text: 'You have successfully canceled your withdrawal.',
      variant: 'done',
    });

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
