<template>
  <teleport to="body">
    <div class="nav-currency" @mouseleave="close">
      <div class="header">
        <button-base
          v-for="{id, title} in props.tabs"
          :key="id"
          :id="id"
          type="ghost"
          size="sm"
          :is-active="selected === id"
          @click="select(id)"
        >
          {{ title }}
        </button-base>
      </div>

      <div class="content">
        <div class="items">
          <div
            v-for="currency in selectedItems"
            :key="currency.code"
            class="item"
            @click="addCurrency(currency)"
          >
            <img class="img" :src="`/img/currency/${currency.code}.svg`" alt=""/>
            <span class="title">{{ currency.name }}</span>
            <span class="label">{{ currency.code }}</span>
          </div>
        </div>
        <div class="nav-currency__plug" v-if="!selectedItems.length && !cryptoCurrencies.length">
          <img class="nav-currency__plug-img" src="@/assets/img/currency-plug.svg" alt="">
          <h4 class="nav-currency__plug-title">Done!</h4>
          <p class="nav-currency__plug-text">You have already added all currencies</p>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { CurrencyInterface } from '@platform/frontend-core/dist/module';
  import { useWalletStore } from '~/composables/useWalletStore';

  const props = defineProps({
    tabs: Array,
    default: () => [],
  });

  const walletStore = useWalletStore();
  const globalStore = useGlobalStore();
  const { accounts } = storeToRefs(walletStore);
  const { currencies } = storeToRefs(globalStore);

  const accountCurrencies = computed(() => accounts.value.map((account) => account.currency));

  const filteredCurrencies = computed(() => currencies.value.filter((currency) => !accountCurrencies.value.includes(currency.code)));
  const cryptoCurrencies = computed(() => filteredCurrencies.value.filter((currency) => currency.type === 'crypto'));

  const selected = ref<string>('all');

  const emit = defineEmits(['toggleNavEmpty']);
  const selectedItems = computed(() => {
    if (!filteredCurrencies.value.length) {
      emit('toggleNavEmpty', true);
    } else emit('toggleNavEmpty', false);

    if (selected.value === 'all') return filteredCurrencies.value;
    return cryptoCurrencies.value;
  });

  const select = (id:string):void => {
    selected.value = id;
  };

  const { closeCurrencyNav } = useLayoutStore();
  const close = ():void => {
    closeCurrencyNav();
  };

  const { createAccount } = useWalletStore();
  const addCurrency = async (currency:CurrencyInterface):Promise<void> => {
    await createAccount(currency.code);
    close();
  };
</script>

<style lang="scss">
.nav-currency {
  max-height: rem(360px);
  height: 100%;
  padding: rem(16px);
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--gray-800);
  z-index: var(--z-index, 3);
  visibility: var(--nav-currency-visibility, hidden);
  transform: translateY(var(--nav-currency-translate-y, 100%));
  transition: all .2s ease-in-out;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.24);

  @include media(sm) {
    border-radius: 8px;
  }

  @include media(md) {
    position: absolute;
    width: rem(288px);
    left: auto;
    bottom: auto;
    transition: none;
    right: rem(32px);
    top: var(--top, #{rem(220px)});
    --z-index: 1;
  }

  @include media(l) {
    --top: #{rem(140px)};
  }

  .header {
    display: flex;
    align-items: center;
    padding-bottom: rem(16px);
    border-bottom: 1px solid var(--gray-700);
    grid-column-gap: rem(4px);
  }

  .btn-ghost {
    --width: 100%;
    white-space: nowrap;
    @include upd-font($body-2);

    &.is-active {
      --color: var(--white);
    }

    @include media(sm) {
      @include upd-font($body-1);
    }
  }

  .btn-primary {
    --width: 100%;
    white-space: nowrap;
    @include upd-font($body-2);

    @include media(sm) {
      @include upd-font($body-1);
    }
  }

  .content {
    margin: rem(8px) 0;
  }

  .items {
    max-height: rem(280px);
    overflow-y: auto;
    @extend %scrollbar;
  }

  .item {
    display: flex;
    align-items: center;
    padding: rem(9px) rem(8px);
    background-color: var(--bg, transparent);
    transition: background-color .1s ease-in-out, color .1s ease-in-out;

    &:hover, &:focus {
      cursor: pointer;
      border-radius: 8px;
      --bg: var(--gray-900);
      --color: var(--yellow-500);
    }
  }

  .title {
    margin-right: rem(4px);
    @include font($heading-1);
    color: var(--color, var(--white));
  }

  .label {
    @include font($heading-1);
    color: var(--gray-400);
    text-transform: uppercase;
  }

  .img {
    @include box(24px);
    display: block;
    margin-right: rem(8px);
  }

  &__plug {
    padding: 24px 16px;
    text-align: center;

    &-img {
      @include box(156px);
      display: block;
      margin: 0 auto;
    }

    &-title {
      @include font($heading-4);
      color: var(--gray-500);
      margin: 16px 0 0;
    }

    &-text {
      @include font($body-2);
      color: var(--gray-600);
      margin: 8px 0 0;
    }
  }
}
</style>
