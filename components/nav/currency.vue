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

        <div class="nav-currency__plug" v-if="selected === 'crypto' && !cryptoCurrencies.length">
          <img class="nav-currency__plug-img" src="/img/currency-plug.svg" alt="">
          <h4 class="nav-currency__plug-title">
            {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'currencyPopup.empty.title') }}
          </h4>
          <p class="nav-currency__plug-text">
            {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'currencyPopup.empty.description') }}
          </p>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ICurrency } from '@skeleton/core/types';

  const props = defineProps({
    tabs: Array,
    default: () => [],
  });

  const walletStore = useWalletStore();
  const globalStore = useGlobalStore();
  const { accounts } = storeToRefs(walletStore);
  const {
    currencies,
    globalComponentsContent,
    defaultLocaleGlobalComponentsContent,
  } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();

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
  const addCurrency = async (currency:ICurrency):Promise<void> => {
    await createAccount(currency.code);
    close();
  };
</script>

<style src="~/assets/styles/components/nav/currency.scss" lang="scss" />

