<template>
  <div class="list-currencies" :class="{'is-show': props.isOpen}">
    <div class="header">
      <button-base
        v-for="{id, title} in currencyTabs"
        :is-active="id === selected"
        :key="id"
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
        :class="{'is-active': activeAccount.currency === item.nativeCurrency}"
        @click="selectCurrency(item.nativeCurrency)"
      >
        <img class="img" :src="`/img/currency/${item.nativeCurrency}.svg`" alt=""/>
        <span class="code-title">{{ item.currency }}</span>
        <span v-if="!props.hideBalance" class="amount">{{ item.amount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { AccountInterface, CurrencyInterface } from '@platform/frontend-core/dist/module';

  const props = defineProps({
    isOpen: {
      type: Boolean,
      default: false,
    },
    hideBalance: {
      type: Boolean,
      default: false,
    },
  });

  const walletStore = useWalletStore();
  const globalStore = useGlobalStore();
  const { accounts, currencyTabs, activeAccount } = storeToRefs(walletStore);
  const { currencies } = storeToRefs(globalStore);
  const { switchAccount } = useWalletStore();
  const { createAccount } = useWalletStore();
  const { formatBalance } = useProjectMethods();
  const { sortByAlphabet } = useProjectMethods();

  const emit = defineEmits(['hide-currencies-list', 'changeActiveAccount']);

  const cryptoCurrencies = computed(() => currencies.value.filter((currency) => currency.type === 'crypto'));

  const selected = ref<string>('all');

  const getAccountByCurrency = (currency: string):AccountInterface|undefined => accounts.value.find((account) => (account.currency === currency));

  const selectedItems = computed(() => {
    let currenciesList:CurrencyInterface[];
    if (selected.value === 'all' || !cryptoCurrencies.value.length) currenciesList = currencies.value;
    else currenciesList = cryptoCurrencies.value;

    const formatList:{ nativeCurrency: string, currency: string, amount: number }[] = currenciesList.map((currency) => {
      const findAccount = getAccountByCurrency(currency.code);
      const formattedAcc = formatBalance(findAccount?.currency || currency.code, findAccount?.balance || 0);
      return { nativeCurrency: currency.code, ...formattedAcc };
    });

    const withBalanceList:{ nativeCurrency: string, currency: string, amount: number }[] = [];
    const withoutBalanceList:{ nativeCurrency: string, currency: string, amount: number }[] = [];

    formatList.forEach((formatItem) => {
      if (formatItem.amount) withBalanceList.push(formatItem);
      else withoutBalanceList.push(formatItem);
    });

    const withBalanceSortedList = withBalanceList.sort((prev, next) => sortByAlphabet(prev.currency.toLowerCase(), next.currency.toLowerCase()));
    const withoutBalanceSortedList = withoutBalanceList.sort((prev, next) => sortByAlphabet(prev.currency.toLowerCase(), next.currency.toLowerCase()));

    return [...withBalanceSortedList, ...withoutBalanceSortedList];
  });

  const selectCurrency = async (currency: string): Promise<void> => {
    if (activeAccount.value?.currency === currency) return;

    const findAccount = getAccountByCurrency(currency);

    emit('hide-currencies-list');

    if (findAccount) {
      await switchAccount({
        accountId: findAccount.id,
        currency: findAccount.currency,
      });
    } else {
      await createAccount(currency);
      const findNewAccount = getAccountByCurrency(currency);
      if (findNewAccount) {
        await switchAccount({
          accountId: findNewAccount.id,
          currency: findNewAccount.currency,
        });
      }
    }

    emit('changeActiveAccount');
  };

  const switchTabNav = (id:string) => {
    selected.value = id;
  };
</script>

<style lang="scss">
.list-currencies {
  display: var(--display, none);
  min-width: rem(200px);
  max-height: rem(360px);
  padding: rem(16px);
  position: absolute;
  top: 0;
  left: 50%;
  right: 0;
  background-color: var(--gray-800);
  z-index: var(--z-index, 3);
  transform: translateX(-50%) translateY(44px);
  transition: all .2s ease-in-out;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.24);
  border-radius: 8px;

  &.is-show {
    --display: block;
  }

  .header {
    border-bottom: 1px solid var(--gray-700);
    display: flex;
    padding: 0 0 rem(8px) 0;
    grid-column-gap: rem(4px);
    margin-bottom: rem(8px);
  }

  .btn-ghost {
    @include upd-font($body-2);
    white-space: nowrap;
    --padding: #{rem(4px)} #{rem(6px)};
    --color: var(--gray-300);
    --width: 100%;

    &.is-active {
      --color: var(--white);
    }

    @include media(sm) {
      @include upd-font($body-1);
    }

    @include use-hover {
      &:hover {
        --color: var(--yellow-500);
      }
    }
  }

  .items {
    display: grid;
    max-height: calc(calc(calc(#{rem(32px)} + #{rem(4px)}) * 6) - #{rem(4px)});
    overflow-y: scroll;
    @include scrollbar;
    padding-right: 2px;
    margin-right: -6px;
    grid-row-gap: 4px;
  }

  .item {
    height: rem(32px);
    background-color: var(--bg, transparent);
    display: flex;
    align-items: center;
    border-radius: 4px;
    padding: 8px;
    grid-column-gap: rem(4px);
    transition: all .2s ease-in-out;

    @include use-hover {
      &:hover {
        &:not(.is-active) {
          cursor: pointer;
          --bg: var(--gray-700);
        }
      }

      &.is-active {
        cursor: text;
        --bg: var(--gray-700);

        .amount {
          --color: var(--yellow-500);
        }
      }
    }

    .img {
      @include box(20px);
    }

    .code-title, .amount {
      @include font($body-1);
    }

    .code-title {
      color: var(--color, var(--gray-400));
      flex-grow: 1;
    }

    .amount {
      color: var(--color, var(--white));
      justify-self: flex-end;
      transition: all .2s ease-in-out;
    }
  }
}
</style>
