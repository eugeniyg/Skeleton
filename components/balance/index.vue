<template>
  <div class="balance">
    <div class="row">
      <div class="label">
        {{ props.withdraw ?  depositContent?.balanceLabel : withdrawContent?.balanceLabel}}
      </div>

      <div class="value">
        {{ balanceFormat.amount }} {{ balanceFormat.currency }}
      </div>
    </div>

    <div class="row" v-if="props.withdraw">
      <div class="label">{{ withdrawContent?.withdrawLabel }}</div>
      <div class="value">
        {{ balanceFormat.amount }} {{ balanceFormat.currency }}
      </div>
    </div>
    <atomic-divider />
    <slot/>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { DepositInterface, WithdrawInterface } from '~/types';

  const props = defineProps({
    withdraw: {
      type: Boolean,
      default: false,
    },
  });

  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);
  const { popupsData } = useGlobalStore();
  const depositContent: DepositInterface|undefined = popupsData?.deposit;
  const withdrawContent: WithdrawInterface|undefined = popupsData?.withdraw;
  const { formatBalance } = useProjectMethods();
  const balanceFormat = computed(() => formatBalance(activeAccount.value.currency, activeAccount.value.balance));
</script>

<style lang="scss" src="./style.scss"/>
