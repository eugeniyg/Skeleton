<template>
  <div class="content">
    <div class="header">
      <h1 class="heading">Wallet</h1>
      <button-base
        id="open-currency-nav"
        type="secondary"
        size="md"
        @click="openCurrNav"
      >
        <atomic-icon id="ui-plus"/>Add currency
      </button-base>
    </div>

    <client-only>
      <nav-currency/>
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

  const { currencies } = useGlobalStore();
  console.log(accounts.value);
  console.log(currencies);

  const openCurrNav = (e:any):void => {
    openCurrencyNav();
    const {
      bottom, left, right, width,
    } = e.target.getBoundingClientRect();
    const nav = document.querySelector('.nav-currency');
    // nav.style.cssText = `top:${ bottom + 4 }px; left:${right - 288}px `;
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
