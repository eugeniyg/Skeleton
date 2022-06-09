<template>
  <div class="content">
    <div class="header">
      <h1 class="heading">Wallet</h1>

      <button-base
        id="open-currency-nav"
        type="secondary"
        size="md"
        :isDisabled="currencyNavEmpty"
        @click="openCurrNav"
      >
        <atomic-icon id="ui-plus"/>Add currency
      </button-base>
    </div>

    <client-only>
      <nav-currency @toggleNavEmpty="currencyNavEmpty = $event"/>
    </client-only>

    <card-wallet
      v-for="account in accounts"
      :key="account.id"
      v-bind="account"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const walletStore = useWalletStore();
  const { accounts } = storeToRefs(walletStore);
  const layoutStore = useLayoutStore();
  const { isCurrencyNavOpen } = storeToRefs(layoutStore);
  const { openCurrencyNav, closeCurrencyNav } = layoutStore;
  const currencyNavEmpty = ref<boolean>(false);

  const openCurrNav = ():void => {
    openCurrencyNav();
  };

  onMounted(() => {
    document.body.addEventListener('click', (e:any) => {
      if (!e.target.closest('.nav-currency') && !e.target.closest('#open-currency-nav') && isCurrencyNavOpen.value) {
        closeCurrencyNav();
      }
    });
  });
</script>

<style lang="scss" src="./style.scss"/>
