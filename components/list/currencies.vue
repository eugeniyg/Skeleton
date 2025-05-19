<template>
  <div class="list-currencies" :class="{ 'is-show': props.isOpen }">
    <div class="header">
      <button-base
        v-for="{ id, title } in currencyTabs"
        :key="id"
        :is-active="id === selected"
        type="ghost"
        size="xs"
        @click.stop="switchTabNav(id)"
      >
        {{ title }}
      </button-base>
    </div>

    <div class="items">
      <div
        v-for="item in selectedItems"
        :key="item.nativeCurrency"
        class="item"
        :class="{ 'is-active': activeAccount?.currency === item.nativeCurrency }"
        @click="selectCurrency(item.nativeCurrency)"
      >
        <atomic-image
          class="img"
          :src="`/img/currency/${item.nativeCurrency}.svg`"
          default-image="/img/currency/placeholder.svg"
        />
        <span class="code-title">{{ item.currency }}</span>
        <span v-if="!props.hideBalance" class="amount">{{ item.currencySymbol }} {{ item.amount }}</span>
      </div>
    </div>

    <atomic-fiat-toggler v-if="showFiatToggler" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IAccount, ICurrency } from '@skeleton/core/types';

  const props = defineProps({
    isOpen: {
      type: Boolean,
      default: false,
    },
    hideBalance: {
      type: Boolean,
      default: false,
    },
    showFiatToggler: {
      type: Boolean,
      default: false,
    },
  });

  const walletStore = useWalletStore();
  const globalStore = useGlobalStore();
  const { accounts, currencyTabs, activeAccount, showEquivalentBalance } = storeToRefs(walletStore);
  const { currencies, cryptoCurrencies } = storeToRefs(globalStore);
  const { switchAccount } = useWalletStore();
  const { createAccount } = useWalletStore();
  const { formatBalance, sortByAlphabet, getEquivalentAccount } = useProjectMethods();

  const emit = defineEmits(['hide-currencies-list', 'changeActiveAccount']);

  const selected = ref<string>('all');

  const getAccountByCurrency = (currency: string): Maybe<IAccount> =>
    accounts.value.find(account => account.currency === currency);

  interface IDisplayAccount {
    nativeCurrency: string;
    currency: string;
    amount: number;
    currencySymbol?: string;
  }

  const formatCurrenciesList = (list: IDisplayAccount[]) => {
    return list.sort((prev, next) => sortByAlphabet(prev.currency.toLowerCase(), next.currency.toLowerCase()));
  };

  const selectedItems = computed(() => {
    let currenciesList: ICurrency[];
    if (selected.value === 'all' || !cryptoCurrencies.value.length) currenciesList = currencies.value;
    else currenciesList = cryptoCurrencies.value;

    const formatList: IDisplayAccount[] = currenciesList.map(currency => {
      const findAccount = getAccountByCurrency(currency.code);

      if (showEquivalentBalance.value) {
        const equivalentAccount = getEquivalentAccount(
          findAccount?.balance || 0,
          findAccount?.currency || currency.code
        );
        return {
          nativeCurrency: currency.code,
          amount: equivalentAccount.balance,
          currency: currency.code,
          currencySymbol: equivalentAccount.currencySymbol,
        };
      }

      const formattedAcc = formatBalance(findAccount?.currency || currency.code, findAccount?.balance || 0);
      return { nativeCurrency: currency.code, ...formattedAcc };
    });

    const withBalanceList: IDisplayAccount[] = [];
    const withoutBalanceList: IDisplayAccount[] = [];

    formatList.forEach(formatItem => {
      if (formatItem.amount) withBalanceList.push(formatItem);
      else withoutBalanceList.push(formatItem);
    });

    const withBalanceSortedList = formatCurrenciesList(withBalanceList);
    const withoutBalanceSortedList = formatCurrenciesList(withoutBalanceList);

    return [...withBalanceSortedList, ...withoutBalanceSortedList];
  });

  const selectCurrency = async (currency: string): Promise<void> => {
    if (activeAccount.value?.currency === currency) return;

    const findAccount = getAccountByCurrency(currency);

    emit('hide-currencies-list');

    if (findAccount) {
      await switchAccount(findAccount.id);
    } else {
      await createAccount(currency);
      const findNewAccount = getAccountByCurrency(currency);
      if (findNewAccount) {
        await switchAccount(findNewAccount.id);
      }
    }

    emit('changeActiveAccount');
  };

  const switchTabNav = (id: string) => {
    selected.value = id;
  };
</script>

<style src="~/assets/styles/components/list/currencies.scss" lang="scss" />
