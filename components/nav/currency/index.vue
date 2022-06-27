<template>
  <teleport to="body">
    <div class="nav-currency" @mouseleave="close">
      <div class="header">
        <template v-if="cryptoCurrencies.length">
          <button-base
            v-for="{id, title} in navItems"
            :key="id"
            :id="id"
            type="ghost"
            size="sm"
            :is-active="selected === id"
            @click="select(id)"
          >
            {{ title }}
          </button-base>
        </template>
      </div>

      <div class="content">
        <div class="items">
          <div
            v-for="currency in selectedItems"
            :key="currency.code"
            class="item"
            @click="addCurrency(currency)"
          >
            <img class="img" :src="`/img/currency/${currency.type === 'crypto' ? '1.png' : '2.png'}`" />
            <span class="title">{{ currency.name }}</span>
            <span class="label">{{ currency.code }}</span>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { CurrencyInterface } from '~/types/globalDataTypes';
  import { useWalletStore } from '~/composables/useWalletStore';

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

  const accountCurrencies = computed(() => accounts.value.map((account) => account.currency));

  const filteredCurrencies = computed(() => currencies.value.filter((currency) => !accountCurrencies.value.includes(currency.code)));
  const cryptoCurrencies = computed(() => filteredCurrencies.value.filter((currency) => currency.type === 'crypto'));

  const selected = ref<string>('all');

  const emit = defineEmits(['toggleNavEmpty']);
  const selectedItems = computed(() => {
    if (!filteredCurrencies.value.length) {
      emit('toggleNavEmpty', true);
    } else emit('toggleNavEmpty', false);

    if (selected.value === 'all' || !cryptoCurrencies.value.length) return filteredCurrencies.value;
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

<style lang="scss" src="./style.scss"/>
