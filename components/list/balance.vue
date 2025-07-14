<template>
  <div class="list-balance" :class="{ 'is-show': props.isOpen }">
    <div class="header">
      <button-base
        key="balance"
        :is-active="selected === 'balance'"
        type="ghost"
        size="xs"
        @click.stop="switchTabNav('balance')"
      >
        {{ getContent(layoutData, defaultLocaleLayoutData, 'header.balance.tabs.balanceTab') }}
      </button-base>

      <button-base
        key="currency"
        :is-active="selected === 'currency'"
        type="ghost"
        size="xs"
        @click.stop="switchTabNav('currency')"
      >
        {{ getContent(layoutData, defaultLocaleLayoutData, 'header.balance.tabs.currencyTab') }}
      </button-base>
    </div>

    <div v-if="selected === 'currency'" class="items">
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
        <span class="amount">{{ item.currencySymbol }} {{ item.amount }}</span>
      </div>
    </div>

    <div v-else-if="selected === 'balance'" class="list-balance__items">
      <div class="list-balance__item">
        <atomic-icon id="wallet" class="list-balance__icon" />
        <div class="list-balance__title">
          {{ getContent(layoutData, defaultLocaleLayoutData, 'header.balance.items.real') }}
        </div>
        <span class="list-balance__value"
          >{{ activeAccountBalances.real.currencySymbol }} {{ activeAccountBalances.real.balance }}</span
        >
        <atomic-image
          v-if="activeAccountBalances.real.currencyIcon"
          class="currency-icon"
          :src="`/img/currency/${activeAccountBalances.real.currencyIcon}.svg`"
          default-image="/img/currency/placeholder.svg"
        />
      </div>

      <div class="list-balance__item">
        <atomic-icon id="bonus" class="list-balance__icon" />
        <span class="list-balance__title">{{
          getContent(layoutData, defaultLocaleLayoutData, 'header.balance.items.bonus')
        }}</span>
        <span class="list-balance__value"
          >{{ activeAccountBalances.bonus.currencySymbol }} {{ activeAccountBalances.bonus.balance }}</span
        >
        <atomic-image
          v-if="activeAccountBalances.bonus.currencyIcon"
          class="currency-icon"
          :src="`/img/currency/${activeAccountBalances.bonus.currencyIcon}.svg`"
          default-image="/img/currency/placeholder.svg"
        />

        <div v-if="props.isOpen && activePlayerBonuses.length" class="list-balance__bonus-progress">
          <bonuses-wager-progress :bonus-info="activePlayerBonuses[0]" />
        </div>
      </div>

      <div class="list-balance__item">
        <atomic-icon id="withdraw" class="list-balance__icon" />
        <span class="list-balance__title">{{
          getContent(layoutData, defaultLocaleLayoutData, 'header.balance.items.withdrawal')
        }}</span>
        <span class="list-balance__value"
          >{{ activeAccountBalances.withdrawal.currencySymbol }} {{ activeAccountBalances.withdrawal.balance }}</span
        >
        <atomic-image
          v-if="activeAccountBalances.withdrawal.currencyIcon"
          class="currency-icon"
          :src="`/img/currency/${activeAccountBalances.withdrawal.currencyIcon}.svg`"
          default-image="/img/currency/placeholder.svg"
        />
      </div>

      <div v-for="(cashback, index) in cashbackBalance" :key="index" class="list-balance__item">
        <atomic-icon id="cashback" class="list-balance__icon" />
        <span class="list-balance__title">{{
          getContent(layoutData, defaultLocaleLayoutData, 'header.balance.items.cashback')
        }}</span>
        <span class="list-balance__value">{{ cashback.currencySymbol }} {{ cashback.balance }}</span>
        <atomic-image
          v-if="cashback.currencyIcon"
          class="currency-icon"
          :src="`/img/currency/${cashback.currencyIcon}.svg`"
          alt=""
          default-image="/img/currency/placeholder.svg"
        />

        <div v-if="cashback.date" class="list-balance__cashback-date">
          <span>{{ getContent(layoutData, defaultLocaleLayoutData, 'header.balance.cashbackDateLabel') }}</span>
          <span>{{ dayjs(cashback.date).format('DD.MM.YYYY') }}</span>
        </div>
      </div>
    </div>

    <atomic-fiat-toggler v-if="activeAccountType === 'crypto'" />
  </div>
</template>

<script setup lang="ts">
  import type { IAccount, ICurrency } from '@skeleton/core/types';

  const props = defineProps({
    isOpen: {
      type: Boolean,
      default: false,
    },
  });

  const dayjs = useDayjs();
  const walletStore = useWalletStore();
  const globalStore = useGlobalStore();
  const { accounts, activeAccount, activeAccountType, showEquivalentBalance } = storeToRefs(walletStore);

  const { currencies, cryptoCurrencies, layoutData, defaultLocaleLayoutData } = storeToRefs(globalStore);

  const { switchAccount } = useWalletStore();
  const { createAccount } = useWalletStore();
  const { formatBalance, sortByAlphabet, getEquivalentAccount, getContent } = useProjectMethods();

  const bonusStore = useBonusStore();
  const { activePlayerBonuses, playerCashback } = storeToRefs(bonusStore);

  const emit = defineEmits(['close', 'changeActiveAccount']);

  const selected = ref<string>('balance');
  const selectedCurrency = ref<string>('all');

  const getAccountByCurrency = (currency: string): Maybe<IAccount> =>
    accounts.value.find(account => account.currency === currency);

  interface IDisplayAccount {
    nativeCurrency: string;
    currency: string;
    amount: number;
    currencySymbol?: string;
  }

  const formatCurrenciesList = (list: IDisplayAccount[]) => {
    return list
      .filter(item => accounts.value.find(account => account.currency === item.nativeCurrency))
      .sort((prev, next) => sortByAlphabet(prev.currency.toLowerCase(), next.currency.toLowerCase()));
  };

  const selectedItems = computed(() => {
    let currenciesList: ICurrency[];
    if (selectedCurrency.value === 'all' || !cryptoCurrencies.value.length) {
      currenciesList = currencies.value;
    } else {
      currenciesList = cryptoCurrencies.value;
    }

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

  interface IBalance {
    balance: number;
    currency: string;
    currencySymbol?: string;
    currencyIcon?: string;
    date?: string;
  }
  const getBalanceFormat = (amount: number): IBalance => {
    if (showEquivalentBalance.value) {
      const bundle = getEquivalentAccount(amount, activeAccount.value?.currency);
      return { ...bundle, currencyIcon: activeAccount.value?.currency };
    }

    const bundle = formatBalance(activeAccount.value?.currency, amount);
    return { balance: bundle.amount, currency: bundle.currency };
  };

  const cashbackBalance = computed<IBalance[]>(() => {
    if (playerCashback.value.length) {
      return playerCashback.value.map(cashback => {
        const bundle = getBalanceFormat(cashback.amount);
        return { ...bundle, date: cashback.date };
      });
    }

    const balance = getBalanceFormat(0);
    return [balance];
  });

  const activeAccountBalances = computed<{ real: IBalance; bonus: IBalance; withdrawal: IBalance }>(() => {
    const real = getBalanceFormat((activeAccount.value?.realBalance || 0) + (activeAccount.value?.lockedBalance || 0));
    const bonus = getBalanceFormat(activeAccount.value?.bonusBalance || 0);
    const withdrawal = getBalanceFormat(activeAccount.value?.withdrawalBalance || 0);

    return { real, bonus, withdrawal };
  });

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

<style src="~/assets/styles/components/list/balance.scss" lang="scss" />
