<template>
  <teleport to="body">
    <div class="nav-currency" @mouseleave="close">
      <div class="header">
        <button-base
          v-for="{id, title} in navItems"
          :key="id"
          :id="id"
          tag-name="button"
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
          >
            <img class="img" :src="`/img/currency/${currency.type === 'crypto' ? '1.png' : '2.png'}`" />
            <span class="title">{{ currency.name }}</span>
            <span class="label">{{ currency.code }}</span>
          </div>
        </div>
      </div>
      <button-base type="primary" size="md">Add currency</button-base>
    </div>
  </teleport>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const navItems = [
    {
      id: 'all',
      title: 'All currency',
    },
    {
      id: 'crypto',
      title: 'Crypto',
    },
  ];
  const walletStore = useWalletStore();
  const globalStore = useGlobalStore();
  const { accounts } = storeToRefs(walletStore);
  const { currencies } = storeToRefs(globalStore);
  const accountsCurrency = accounts.value.map((account) => {
    const accountCurrency = currencies.value.find((currency) => {
      if (!currency.subCurrencies.length) {
        return currency.code === account.formatBalance.currency;
      }
      return currency.subCurrencies.some((sub) => sub.code === account.formatBalance.currency);
    });
    return accountCurrency.code;
  });
  const filteredCurrencies = currencies.value.filter((currency) => !accountsCurrency.includes(currency.code));
  const cryptoCurrencies = filteredCurrencies.filter((currency) => currency.type === 'crypto');

  const selected = ref<string>('all');
  const selectedItems = computed(() => {
    if (selected.value === 'all') return filteredCurrencies;
    return cryptoCurrencies;
  });
  const select = (id:string):void => {
    selected.value = id;
  };

  const { closeCurrencyNav } = useLayoutStore();
  const close = ():void => {
    closeCurrencyNav();
  };
</script>

<style lang="scss" src="./style.scss"/>
