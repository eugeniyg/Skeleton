<template>
  <div class="tb-transactions-history" :class="{ 'tb-transactions-history__short': props.invoices?.length < 3 }">
    <div class="row">
      <div v-for="(th, thIndex) in headTitles" :key="thIndex" class="th">{{ th }}</div>
    </div>

    <div v-for="invoice in props.invoices" :key="invoice.id" class="row td-row">
      <div class="td">{{ dayjs(invoice.createdAt).format('DD.MM.YYYY, HH:mm') }}</div>

      <div class="td">
        {{
          getContent(
            globalComponentsContent,
            defaultLocaleGlobalComponentsContent,
            `constants.invoiceTypes.${invoice.invoiceType}`
          )
        }}
      </div>

      <div class="td">
        <copy-transaction-id :value="invoice.id" />
      </div>

      <div class="td">{{ invoice.paymentMethod }}</div>

      <div class="td">
        <atomic-invoice-status :variant="invoice.status">
          {{
            getContent(
              globalComponentsContent,
              defaultLocaleGlobalComponentsContent,
              `constants.invoiceStatuses.${invoice.status}`
            )
          }}
        </atomic-invoice-status>
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
          <atomic-icon id="security-code" />
          <span>{{ props.transactionsContent?.securityCode?.getCodeButton }}</span>
        </button-base>

        <button-base
          v-if="invoice.status === 1 && invoice.invoiceType === 2"
          class="btn-cancel-payment"
          type="secondary"
          size="sm"
          @click.once="emit('cancelPayment', invoice.id)"
        >
          <atomic-icon id="trash" />
          <span>{{ props.transactionsContent?.cancelPaymentButton }}</span>
        </button-base>

        <button-base
          v-if="
            invoice.publicData?.agentNumber &&
            invoice.publicData?.transactionId &&
            invoice.invoiceType === 1 &&
            dosafepayTargetMethods.includes(invoice.paymentMethod) &&
            !showDetails.includes(invoice.publicData.transactionId)
          "
          class="btn-get-code"
          type="primary"
          size="sm"
          @click="showDetails.push(invoice.publicData?.transactionId)"
        >
          <atomic-icon id="more-info" />
          <span>{{ props.transactionsContent?.dosafepayData?.showDetailsButton }}</span>
        </button-base>
      </div>

      <div
        v-if="invoice.publicData?.securityCode && showCodes.includes(invoice.publicData.securityCode)"
        class="security-code"
      >
        <atomic-copy-field
          :label="props.transactionsContent?.securityCode?.codeLabel"
          :value="invoice.publicData.securityCode"
          :tooltip="props.transactionsContent?.securityCode?.codeTooltip"
        />

        <atomic-copy-field
          :label="props.transactionsContent?.securityCode?.clientLabel"
          :value="invoice.publicData.clientId"
          :tooltip="props.transactionsContent?.securityCode?.clientTooltip"
        />
      </div>

      <div
        v-if="
          invoice.publicData?.agentNumber &&
          invoice.publicData?.transactionId &&
          dosafepayTargetMethods.includes(invoice.paymentMethod) &&
          showDetails.includes(invoice.publicData?.transactionId)
        "
        class="security-code"
      >
        <atomic-copy-field
          :label="props.transactionsContent?.dosafepayData?.numberLabel"
          :value="invoice.publicData.agentNumber"
          :tooltip="props.transactionsContent?.dosafepayData?.numberTooltip"
        />

        <atomic-copy-field
          :label="props.transactionsContent?.dosafepayData?.clientLabel"
          :value="invoice.publicData.transactionId"
          :tooltip="props.transactionsContent?.dosafepayData?.clientTooltip"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ITransactionsHistory } from '~/types';
  import type { IInvoice } from '@skeleton/api/types';

  const props = defineProps<{
    invoices: IInvoice[];
    transactionsContent: ITransactionsHistory;
  }>();

  const emit = defineEmits(['cancelPayment']);
  const headTitles = Object.values(props.transactionsContent.tableColumns);
  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = globalStore;
  const dayjs = useDayjs();
  const showCodes = ref<string[]>([]);
  const showDetails = ref<string[]>([]);
  const dosafepayTargetMethods: string[] = ['Rocket', 'Nagad', 'Bkash', 'Upay'];
</script>

<style src="~/assets/styles/components/table/transactions-history.scss" lang="scss" />
