<template>
  <div class="list-balance" :class="{'is-show': props.isOpen}">
    <div class="header">
      <button-base
        v-for="{id, title} in getContent(layoutData, defaultLocaleLayoutData, 'header.balance.tabs')"
        :is-active="id === selected"
        :key="id"
        type="ghost"
        size="xs"
        @click.stop="switchTabNav(id)"
      >
        {{ title }}
      </button-base>
    </div>

    <div class="items" v-if="selected === 'currency'">
      <div
        v-for="item in selectedItems"
        :key="item.nativeCurrency"
        class="item"
        :class="{'is-active': activeAccount.currency === item.nativeCurrency}"
        @click="selectCurrency(item.nativeCurrency)"
      >
        <img class="img" :src="`/img/currency/${item.nativeCurrency}.svg`" alt=""/>
        <span class="code-title">{{ item.currency }}</span>
        <span class="amount">{{ item.currencySymbol }} {{ item.amount }}</span>
      </div>
    </div>

    <div class="list-balance__items" v-else-if="selected === 'balance'">

      <div class="list-balance__item">
        <atomic-icon id="wallet" class="list-balance__icon"/>
        <div class="list-balance__title">{{ getContent(layoutData, defaultLocaleLayoutData, 'header.balance.items.real') }}</div>
        <span class="list-balance__value">{{ activeAccountBalances.real }}</span>
        <img
          class="currency-icon"
          v-if="activeAccountBalances.currencyIcon"
          :src="`/img/currency/${activeAccountBalances.currencyIcon}.svg`" alt=""
        />
      </div>

      <div class="list-balance__item">
        <atomic-icon id="bonus" class="list-balance__icon"/>
        <span class="list-balance__title">{{ getContent(layoutData, defaultLocaleLayoutData, 'header.balance.items.bonus') }}</span>
        <span class="list-balance__value">{{ activeAccountBalances.bonus }}</span>
        <img
          class="currency-icon"
          v-if="activeAccountBalances.currencyIcon"
          :src="`/img/currency/${activeAccountBalances.currencyIcon}.svg`" alt=""
        />
      </div>

      <div class="list-balance__item">
        <atomic-icon id="withdraw" class="list-balance__icon"/>
        <span class="list-balance__title">{{ getContent(layoutData, defaultLocaleLayoutData, 'header.balance.items.withdrawal') }}</span>
        <span class="list-balance__value">{{ activeAccountBalances.withdrawal }}</span>
        <img
          class="currency-icon"
          v-if="activeAccountBalances.currencyIcon"
          :src="`/img/currency/${activeAccountBalances.currencyIcon}.svg`" alt=""
        />
      </div>

      <!--      <div class="list-balance__item">-->
      <!--        <atomic-icon id="cashback" class="list-balance__icon"/>-->
      <!--        <span class="list-balance__title">{{ getContent(layoutData, defaultLocaleLayoutData, 'header.balance.items.cashback') }}</span>-->
      <!--        <div class="list-balance__link">{{ getContent(layoutData, defaultLocaleLayoutData, 'header.balance.items.cashbackLinkLabel') }}</div>-->
      <!--      </div>-->
    </div>

    <atomic-fiat-toggler/>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { IAccount, ICurrency } from '@platform/frontend-core';

  const props = defineProps({
    isOpen: {
      type: Boolean,
      default: false,
    },
  });

  const walletStore = useWalletStore();
  const globalStore = useGlobalStore();
  const {
    accounts,
    activeAccount,
    activeAccountType
  } = storeToRefs(walletStore);

  const {
    currencies,
    cryptoCurrencies,
    equivalentCurrency,
    layoutData,
    defaultLocaleLayoutData
  } = storeToRefs(globalStore);

  const { switchAccount } = useWalletStore();
  const { createAccount } = useWalletStore();
  const {
    formatBalance,
    sortByAlphabet,
    getEquivalentAccount,
    getContent
  } = useProjectMethods();

  const emit = defineEmits(['close', 'changeActiveAccount']);

  const selected = ref<string>('balance');
  const selectedCurrency = ref<string>('all');

  const getAccountByCurrency = (currency: string): Maybe<IAccount> => accounts.value.find((account) => (account.currency === currency));

  interface DisplayAccountInterface {
    nativeCurrency: string,
    currency: string,
    amount: number,
    currencySymbol?: string
  }

  const formatCurrenciesList = (list: DisplayAccountInterface[]) => {
    return list.filter((item) => accounts.value.find((account) => account.currency === item.nativeCurrency))
      .sort((prev, next) => sortByAlphabet(prev.currency.toLowerCase(), next.currency.toLowerCase()));
  };

  const selectedItems = computed(() => {
    let currenciesList: ICurrency[];
    if (selectedCurrency.value === 'all' || !cryptoCurrencies.value.length) {
      currenciesList = currencies.value;
    } else {
      currenciesList = cryptoCurrencies.value;
    }

    const formatList: DisplayAccountInterface[] = currenciesList.map((currency) => {
      const findAccount = getAccountByCurrency(currency.code);

      if (equivalentCurrency.value && currency.type === 'crypto') {
        const equivalentAccount = getEquivalentAccount(findAccount?.balance || 0, findAccount?.currency || currency.code);
        return {
          nativeCurrency: currency.code,
          amount: equivalentAccount.balance,
          currency: currency.code,
          currencySymbol: equivalentAccount.currencySymbol,
        };
      }

      const formattedAcc = formatBalance(findAccount?.currency || currency.code, findAccount?.balance || 0);
      return {
        nativeCurrency: currency.code, ...formattedAcc,
        currencySymbol: equivalentCurrency.value ? currency.symbol : undefined
      };
    });

    const withBalanceList: DisplayAccountInterface[] = [];
    const withoutBalanceList: DisplayAccountInterface[] = [];

    formatList.forEach((formatItem) => {
      if (formatItem.amount) {
        withBalanceList.push(formatItem);
      } else {
        withoutBalanceList.push(formatItem);
      }
    });

    const withBalanceSortedList = formatCurrenciesList(withBalanceList);
    const withoutBalanceSortedList = formatCurrenciesList(withoutBalanceList);

    return [...withBalanceSortedList, ...withoutBalanceSortedList];
  });

  const activeAccountBalances = computed(() => {
    let real;
    let bonus;
    let withdrawal;
    let currencyIcon;

    if (equivalentCurrency.value && activeAccountType.value === 'crypto') {
      currencyIcon = activeAccount.value?.currency;
      const realBalance = getEquivalentAccount((activeAccount.value?.realBalance || 0) + (activeAccount.value?.lockedBalance || 0), activeAccount.value?.currency);
      real = `${realBalance.currencySymbol} ${realBalance.balance}`

      const bonusBalance = getEquivalentAccount(activeAccount.value?.bonusBalance || 0, activeAccount.value?.currency);
      bonus = `${bonusBalance.currencySymbol} ${bonusBalance.balance}`

      const withdrawalBalance = getEquivalentAccount(activeAccount.value?.withdrawalBalance || 0, activeAccount.value?.currency);
      withdrawal = `${withdrawalBalance.currencySymbol} ${withdrawalBalance.balance}`
    } else {
      const realBalance = formatBalance(activeAccount.value?.currency, (activeAccount.value?.realBalance || 0) + (activeAccount.value?.lockedBalance || 0));
      real = realBalance.amount

      const bonusBalance = formatBalance(activeAccount.value?.currency, activeAccount.value?.bonusBalance);
      bonus = bonusBalance.amount

      const withdrawalBalance = formatBalance(activeAccount.value?.currency, activeAccount.value?.withdrawalBalance);
      withdrawal = withdrawalBalance.amount
    }

    return { real, bonus, withdrawal, currencyIcon }
  })

  const selectCurrency = async (currency: string): Promise<void> => {
    if (activeAccount.value?.currency === currency) return;

    const findAccount = getAccountByCurrency(currency);

    emit('close');

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

<style src="~/assets/styles/components/list/balance.scss" lang="scss"/>
