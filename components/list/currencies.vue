<template>
  <div class="list-currencies" :class="{'is-show': isOpen}">
    <div class="header">
      <button-base
        v-for="{id, title} in navTabs"
        :is-active="id === selected"
        :key="id"
        type="ghost"
        size="xs"
        @click.stop="switchTabNav(id)"
      >{{ title }}
      </button-base>
    </div>

    <div class="items">
      <div
        v-for="item in selectedItems"
        :key="item.code"
        class="item"
        :class="{'is-active': active.currency === item.code}"
        @click="selectCurrency(item.code)"
      >
        <img class="img" :src="`/img/currency/${item.code}.svg`" alt=""/>
        <span class="code-title">{{ item.code }}</span>
        <span class="amount">{{ balance[item.code] }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ProfileWalletInterface } from '~/types';
  import { useWalletStore } from '~/composables/useWalletStore';

  const props = defineProps({
    isOpen: {
      type: Boolean,
      default: false,
    },
  });

  const walletStore = useWalletStore();
  const globalStore = useGlobalStore();
  const { accounts } = storeToRefs(walletStore);
  const { currencies, currentLocale } = storeToRefs(globalStore);
  const { switchAccount } = useWalletStore();
  const { createAccount } = useWalletStore();

  const walletContentRequest = await useAsyncData('walletContent', () => queryContent(`profile/${currentLocale.value?.code}`).only(['wallet']).findOne());
  const walletContent:ProfileWalletInterface|undefined = walletContentRequest.data.value?.wallet;

  const navTabs = ref<{id:string, title: string}[]>([]);

  if (walletContent) {
    navTabs.value = [
      {
        id: 'all',
        title: walletContent.allTab,
      },
      {
        id: 'crypto',
        title: walletContent.cryptoTab,
      },
    ];
  }

  const emit = defineEmits(['hide-currencies-list']);

  const cryptoCurrencies = computed(() => currencies.value.filter((currency) => currency.type === 'crypto'));

  const selected = ref<string>('all');

  const selectedItems = computed(() => {
    if (selected.value === 'all' || !cryptoCurrencies.value.length) return currencies.value;
    return cryptoCurrencies.value;
  });

  const active = computed(() => accounts.value.find(({ status }) => status === 1));

  const balance = computed(() => accounts.value.reduce((acc, item) => {
    acc[item.currency] = item.balance;
    return acc;
  }, {}));

  const getAccount = (code:string) => accounts.value.find((account) => account.currency === code);

  const selectCurrency = async (code: string): Promise<void> => {
    const hasAddedCurrency = getAccount(code);

    if (!hasAddedCurrency) {
      await createAccount(code);
      const { id, currency } = getAccount(code);
      await switchAccount({
        accountId: id,
        currency: currency || '',
      });
      emit('hide-currencies-list');
    } else {
      const { id, currency } = hasAddedCurrency;
      await switchAccount({
        accountId: id,
        currency: currency || '',
      });
      emit('hide-currencies-list');
    }
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
