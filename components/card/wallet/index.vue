<template>
  <div class="card-wallet" :class="{'is-active': isActive}">
    <div class="content">
      <div class="title">{{ currencyName }}</div>

      <form-input-toggle
        v-if="!isActive"
        name="toggle"
        :value="isChecked"
        @change="clickToggle"
      >
        Use currency
      </form-input-toggle>

      <div class="amount">
        <span class="amount">{{ props.formatBalance.amount }}</span>
        <span class="currency">{{ props.formatBalance.currency }}</span>
      </div>

      <button-base
        v-if="showHideCurrencyButton"
        class="hide-currency"
        type="ghost"
        size="xs"
        @click="hide"
      >
        Hide currency
      </button-base>

      <div v-if="isActive" class="actions">
        <button-base type="primary" size="md" @click="openDepositModal">Deposit</button-base>
        <button-base type="secondary" size="md" @click="openWithdrawModal">Withdraw</button-base>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    formatBalance: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      required: true,
    },
  });

  const isChecked = ref<boolean>(false);
  const { currencies } = useGlobalStore();
  const { openWithdrawModal, openDepositModal } = useLayoutStore();

  const isActive = computed(() => props.status === 1);
  const showHideCurrencyButton = computed(() => Number(props.formatBalance.amount) === 0 && !isActive.value);
  const currentCurrency = currencies.find((curr) => curr.code === props.currency);
  const currencyName = computed(() => `${currentCurrency.name} (${currentCurrency.code})`);

  const { switchAccount, hideAccount } = useWalletStore();

  const changeActive = async ():Promise<void> => {
    await switchAccount({
      accountId: props.id,
      currency: currentCurrency.code,
    });
    isChecked.value = false;
  };

  const clickToggle = ():void => {
    isChecked.value = true;
    setTimeout(() => {
      changeActive();
    }, 300);
  };

  const hide = async ():Promise<void> => {
    await hideAccount({
      accountId: props.id,
      currency: currentCurrency.code,
    });
  };
</script>

<style lang="scss" src="./style.scss"/>
