<template>
  <div class="tab-history__tb">
    <atomic-filters class="filters-transactions-history">
      <form-input-date :label="props.content?.dateLabel" :settings="dateConfig" @change="changeDate" />

      <form-input-dropdown
        v-model:value="filters.type"
        :label="props.content?.typeFilterLabel"
        name="invoiceType"
        placeholder=""
        :options="typeOptions"
        @input="changeFilters"
      />

      <form-input-dropdown-search
        v-model:value="filters.currency"
        :label="props.content?.currencyLabel"
        :empty-search-title="props.content?.emptyCurrencySearchTitle"
        name="invoiceCurrency"
        placeholder=""
        :options="currenciesOptions"
        @input="changeFilters"
      />

      <form-input-dropdown
        v-model:value="filters.status"
        :label="props.content?.statusFilterLabel"
        name="invoiceStatus"
        placeholder=""
        :options="statusOptions"
        @input="changeFilters"
      />
    </atomic-filters>

    <table-transactions-history
      v-if="invoices.length"
      :invoices="invoices"
      :transactions-content="props.content"
      @cancel-payment="cancelPayment"
    />

    <atomic-pagination
      v-if="pageMeta?.totalPages && pageMeta.totalPages > 1"
      v-bind="pageMeta"
      @select-page="changePage"
    />

    <atomic-empty
      v-if="!invoices.length && !loading"
      variant="transactions"
      :title="props.content?.empty.title"
      :sub-title="props.content?.empty.description"
    />
  </div>
</template>

<script setup lang="ts">
  import type { IInvoice, IInvoicesRequestOptions, IPaginationMeta } from '@skeleton/core/types';
  import type { ITransactionsHistory } from '~/types';

  const props = defineProps<{
    content: ITransactionsHistory;
  }>();

  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent, alertsData, defaultLocaleAlertsData } =
    storeToRefs(globalStore);
  const { getContent } = useProjectMethods();
  const optionsDefaultValue = { value: props.content?.allFilterOption, code: 'all' };

  const typeOptions = computed(() => {
    const storeOptions = globalStore.invoiceTypes.map(item => {
      const typeLabel = getContent(
        globalComponentsContent.value,
        defaultLocaleGlobalComponentsContent.value,
        `constants.invoiceTypes.${item.id}`
      );
      return { value: typeLabel, code: item.id };
    });
    return [optionsDefaultValue, ...storeOptions];
  });

  const statusOptions = computed(() => {
    const storeOptions = globalStore.invoiceStatuses.map(item => {
      const statusLabel = getContent(
        globalComponentsContent.value,
        defaultLocaleGlobalComponentsContent.value,
        `constants.invoiceStatuses.${item.id}`
      );
      return { value: statusLabel, code: item.id };
    });
    return [optionsDefaultValue, ...storeOptions];
  });

  const fieldsStore = useFieldsStore();
  const { selectOptions } = storeToRefs(fieldsStore);
  const currenciesOptions = computed(() => [optionsDefaultValue, ...selectOptions.value.currency]);

  const filters = reactive<{ [key: string]: any }>({
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
      function (date: number) {
        return date > Date.now();
      },
    ],
  };

  const invoices = ref<IInvoice[]>([]);
  const pageMeta = ref<IPaginationMeta>();
  const { getPlayerInvoices, cancelInvoice } = useCoreWalletApi();
  const loading = ref<boolean>(true);
  const resolveInvoicesRequest = async (): Promise<void> => {
    loading.value = true;
    const requestOptions: IInvoicesRequestOptions = {} as IInvoicesRequestOptions;
    Object.keys(filters).forEach(param => {
      if (filters[param] && filters[param] !== 'all') requestOptions[param] = filters[param];
    });
    const response = await getPlayerInvoices(requestOptions);
    invoices.value = response.data;
    pageMeta.value = response.meta;
    loading.value = false;
  };

  const changePage = (page: number): void => {
    if (loading.value) return;
    filters.page = page;
    window.scroll(0, 0);
    resolveInvoicesRequest();
  };

  const { showAlert } = useLayoutStore();
  const cancelPayment = async (invoiceId: string): Promise<void> => {
    const response = await cancelInvoice(invoiceId);
    showAlert(
      alertsData.value?.wallet?.userCanceledWithdrawal || defaultLocaleAlertsData.value?.wallet?.userCanceledWithdrawal
    );

    const closedIndex = invoices.value.findIndex(invoice => invoice.id === invoiceId);
    invoices.value[closedIndex] = response;
  };

  const changeFilters = (): void => {
    filters.page = 1;
    resolveInvoicesRequest();
  };

  const changeDate = (dates: string[]): void => {
    if (dates.length === 2 && (dates[0] !== filters.dateFrom || dates[1] !== filters.dateTo)) {
      [filters.dateFrom, filters.dateTo] = dates;
      resolveInvoicesRequest();
    } else if (dates[0] !== filters.dateFrom || dates[1] !== filters.dateTo) {
      filters.dateFrom = undefined;
      filters.dateTo = undefined;
      resolveInvoicesRequest();
    }
  };

  onMounted(() => {
    resolveInvoicesRequest();
  });
</script>

<style src="~/assets/styles/components/tab/history/transactions.scss" lang="scss" />
