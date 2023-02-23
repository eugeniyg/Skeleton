<template>
  <div class="input-currencies">
    <div class="input-currencies__selected">
      <template v-if="!selectedCurrency">
      </template>
    </div>

    <div class="input-currencies__content">
      <div class="input-currencies__tabs">
        <template v-if="cryptoCurrencies.length">
          <span
            class="input-currencies__tab"
            :class="{'is-active': selected === id}"
            v-for="{id, title} in currencyTabs"
            :key="id"
            :id="id"
            @click="select(id)"
          >
            {{ title }}
          </span>
        </template>
      </div>
      <div class="input-currencies__list">
        <div
          v-for="currency in selectedItems"
          :key="currency.code"
          class="input-currencies__item"
          :class="{'is-active': selectedCurrency.name === currency.name}"
          @click="selectCurrency(currency)"
        >
          <img class="input-currencies__item-img" :src="`/img/currency/${currency.code}.svg`" alt=""/>
          <span class="input-currencies__item-title">{{ currency.name }}</span>
          <span class="input-currencies__item-code">{{ currency.code }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { CurrencyInterface } from '@platform/frontend-core/dist/module';
  import { useWalletStore } from '~/composables/useWalletStore';

  const walletStore = useWalletStore();
  const globalStore = useGlobalStore();
  const { currencyTabs } = storeToRefs(walletStore);
  const { currencies } = storeToRefs(globalStore);

  const cryptoCurrencies = computed(() => currencies.value.filter((currency) => currency.type === 'crypto'));

  const selected = ref<string>('all');
  const selectedCurrency = ref<CurrencyInterface>({});

  const selectedItems = computed(() => {
    if (selected.value === 'all' || !cryptoCurrencies.value.length) return currencies.value;
    return cryptoCurrencies.value;
  });

  const select = (id: string): void => {
    selected.value = id;
  };

  const selectCurrency = (currency: CurrencyInterface) => {
    selectedCurrency.value = currency;
  };
</script>

<style lang="scss">
.input-currencies {
  &__selected {
  }

  &__tabs {
    display: flex;
    align-items: center;
    grid-gap: 4px;
    border-bottom: 1px solid var(--gray-700);
    padding-bottom: 12px;
  }

  &__tab {
    width: 100%;
    @include font($body-1);
    padding: 4px;
    text-align: center;
    color: var(--color, var(--white));
    background-color: var(--bg, transparent);
    border-radius: 8px;

    &.is-active {
      --color: var(--white);
      --bg: var(--gray-700);
    }
  }

  &__content {
    background-color: var(--gray-800);
    box-shadow: 0 0 16px rgba(0, 0, 0, 0.24);
    border-radius: 8px;
    padding: 16px;
  }

  &__list {
    padding: 0;
  }

  &__item {
    display: flex;
    align-items: center;
    padding: 4px;
    background-color: var(--item-bg);

    &.is-active {
      --item-bg: var(--gray-900);
      --title-color: var(--yellow-500);
    }

    &-img {
      width: 24px;
      height: 24px;
      margin-right: 8px;
    }

    &-title {
      @include font($heading-1);
      color: var(--title-color, var(--white));
      margin-right: 4px;
    }

    &-code {
      @include font($body-0);
      color: var(--gray-400);
    }
  }
}
</style>
