<template>
  <div class="content">
    <div class="header">
      <h1 class="heading">{{ walletContent?.title }}</h1>

      <button-base
        id="open-currency-nav"
        type="secondary"
        size="md"
        :isDisabled="currencyNavEmpty"
        @click="openCurrNav"
      >
        <atomic-icon id="plus"/>{{ walletContent?.addButton }}
      </button-base>
    </div>

    <client-only>
      <nav-currency :tabs="navTabs" @toggleNavEmpty="currencyNavEmpty = $event"/>
    </client-only>

    <div class="cards-wallet">
      <card-wallet
        v-for="account in accounts"
        :key="account.id"
        v-bind="account"
        :content="walletContent"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ProfileWalletInterface } from '~/types';

  const globalStore = useGlobalStore();
  const { currentLocale } = storeToRefs(globalStore);
  const walletContentRequest = await useAsyncData('walletContent', () => queryContent(`profile/${currentLocale.value.code}`).only(['wallet']).findOne());
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
