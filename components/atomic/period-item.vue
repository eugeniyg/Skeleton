<template>
  <div
    class="limits-periods-list__item"
  >
    <h4 class="limits-periods-list__item-title">{{ amount }} of {{ getBalance(currency) }} {{ currency }} left</h4>

    <p class="limits-periods-list__item-sub-title">subTitle</p>

    <button-base
      v-if="props.isShowEdit"
      class="limits-periods-list__item-edit"
      type="ghost"
      @click="emit('edit', { id, amount })"
    >
      <atomic-icon id="edit"/>
    </button-base>

    <div
      class="limits-periods-list__item-progress"
      :style="`--progress-width:${ getBalanceDiff(amount, currency) }%`"
      :class="{'is-full': getBalanceDiff(amount, currency) === 100 }"
    />

    <div class="limits-periods-list__item-status">
      <span
        class="limits-periods-list__item-status-type"
        :class="`limits-periods-list__item-status-type--${ limitsStatuses[status].toLowerCase()  }`"
        :data-status="limitsStatuses[status]"
      />
      <pre style="color: white">{{ status }}</pre>
      <span class="limits-periods-list__item-status-title">{{ limitsStatuses[status] }} till {{ dayjs(createdAt).utc().format(DATE_FORMAT) }}</span>
    </div>

  </div>
</template>

<script setup lang="ts">
  import dayjs from 'dayjs';
  import { storeToRefs } from 'pinia';
  import utc from 'dayjs/plugin/utc';

  interface PropsInterface {
    id: string,
    status: string,
    createdAt?: string,
    currency: string,
    expiredAt: string|null,
    cancelProcess: boolean,
    amount: string|number,
    title: string,
    isShowEdit: boolean,
  }

  const props = defineProps<PropsInterface>();

  const emit = defineEmits(['edit']);

  const walletStore = useWalletStore();
  const { accounts } = storeToRefs(walletStore);

  dayjs.extend(utc);
  const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

  const limitsStatuses: Record<number, string> = {
    1: 'Active',
    2: 'Pending',
    3: 'Canceled',
    4: 'Finished',
  };

  const getBalance = (currency: string) => accounts?.value.find((account) => account.currency === currency)?.balance;

  const getBalanceDiff = (amount: number, currency: string) => {
    if (amount && currency) {
      const balance = getBalance(currency) || 0;
      return (amount / balance) * 100;
    }
    return 0;
  };

  const getAmountDiff = (amount: number, currency: string) => {
    const balance = getBalance(currency) || 0;
    return balance ? balance - amount : balance;
  };
</script>
