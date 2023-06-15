<template>
  <div class="balance">
    <div
      class="row"
      :class="{ 'row--compact': showEquivalentBalance }"
    >
      <div class="label">
        {{
          props.withdraw ? getContent(popupsData, defaultLocalePopupsData, 'deposit.balanceLabel')
          : getContent(popupsData, defaultLocalePopupsData, 'withdraw.balanceLabel')
        }}
      </div>

      <template v-if="props.withdraw">
        <div
          v-if="showEquivalentBalance"
          class="value"
        >
          {{ activeEquivalentAccount.balance }} {{ activeEquivalentAccount.currency }}
        </div>

        <div :class="showEquivalentBalance ? 'converted-value' : 'value'">
          {{ balanceFormat.amount }} {{ balanceFormat.currency }}
        </div>
      </template>

      <div
        v-else
        v-click-outside="closeSelect"
        class="select"
        :class="{'is-open': isSelectOpen}"
        @click="toggleSelect"
      >
        <span class="amount">
          <span>{{ balanceFormat.amount }}</span>
          <span>{{ balanceFormat.currency }}</span>
        </span>
        <atomic-icon class="icon-expand" id="arrow_expand-close"/>

        <list-currencies
          :is-open="isSelectOpen"
          hideBalance
          @hide-currencies-list="isSelectOpen = false"
          @click.stop.prevent
          @changeActiveAccount="walletStore.getDepositMethods"
        />
      </div>
    </div>

    <div class="row" v-if="props.withdraw">
      <div class="label">{{ getContent(popupsData, defaultLocalePopupsData, 'withdraw.withdrawLabel') }}</div>

      <div
        class="value"
        v-if="showEquivalentBalance"
      >
        {{ withdrawalEquivalentBalanceFormat.balance }} {{ withdrawalEquivalentBalanceFormat.currency }}
      </div>

      <div :class="showEquivalentBalance ? 'converted-value' : 'value'">
        {{ withdrawalBalanceFormat.amount }} {{ withdrawalBalanceFormat.currency }}
      </div>
    </div>
    <atomic-divider/>
    <slot/>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    withdraw: {
      type: Boolean,
      default: false,
    },
  });

  const walletStore = useWalletStore();
  const globalStore = useGlobalStore();
  const { activeAccount, activeAccountType, activeEquivalentAccount } = storeToRefs(walletStore);
  const { popupsData, defaultLocalePopupsData, equivalentCurrency } = storeToRefs(globalStore);
  const { formatBalance, getContent, getEquivalentAccount } = useProjectMethods();
  const isSelectOpen = ref<boolean>(false);

  const balanceFormat = computed(() => formatBalance(activeAccount.value?.currency, activeAccount.value?.balance));
  const showEquivalentBalance = computed(() => equivalentCurrency.value && activeAccountType.value === 'crypto');
  const withdrawalBalanceFormat = computed(() => formatBalance(activeAccount.value?.currency, activeAccount.value?.withdrawalBalance));
  const withdrawalEquivalentBalanceFormat = computed(() => getEquivalentAccount(activeAccount.value?.withdrawalBalance, activeAccount.value?.currency));

  const toggleSelect = () => {
    isSelectOpen.value = !isSelectOpen.value;
  };

  const closeSelect = () => {
    if (isSelectOpen.value) isSelectOpen.value = false;
  };
</script>

<style src="~/assets/styles/components/balance.scss" lang="scss" />

