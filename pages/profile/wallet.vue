<template>
  <div class="content">
    <div class="header">
      <h1 class="heading">
        {{ pageContent?.currentLocaleData?.title || pageContent?.defaultLocaleData?.title }}
      </h1>

      <button-base
        id="open-currency-nav"
        type="secondary"
        size="md"
        :is-disabled="currencyNavEmpty"
        @click="openCurrNav"
      >
        <atomic-icon id="plus" />{{
          pageContent?.currentLocaleData?.addButton || pageContent?.defaultLocaleData?.addButton
        }}
      </button-base>
    </div>

    <nav-currency :tabs="currencyTabs" @toggle-nav-empty="currencyNavEmpty = $event" />

    <div v-if="pageContent?.currentLocaleData || pageContent?.defaultLocaleData" class="cards-wallet">
      <TransitionGroup name="card">
        <card-wallet
          v-for="account in orderedAccounts"
          :key="account.id"
          v-bind="account"
          :content="pageContent?.currentLocaleData || pageContent?.defaultLocaleData"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IAccount } from '@skeleton/core/types';
  import type { IProfileWallet } from '~/types';

  const contentParams = {
    contentKey: 'profileWalletContent',
    contentRoute: ['profile', 'wallet'],
    isPage: true,
  };
  const { getContentData } = useContentLogic<IProfileWallet>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(getContentData);

  const walletStore = useWalletStore();
  const { accounts, currencyTabs } = storeToRefs(walletStore);
  const layoutStore = useLayoutStore();
  const { isCurrencyNavOpen } = storeToRefs(layoutStore);
  const { openCurrencyNav, closeCurrencyNav } = layoutStore;
  const currencyNavEmpty = ref<boolean>(false);

  const openCurrNav = (): void => {
    openCurrencyNav();
  };

  const clickOutside = (e: any) => {
    if (!e.target.closest('.nav-currency') && !e.target.closest('#open-currency-nav') && isCurrencyNavOpen.value) {
      closeCurrencyNav();
    }
  };

  onMounted(() => {
    document.body.addEventListener('click', clickOutside);
  });

  onBeforeUnmount(() => {
    document.body.removeEventListener('click', clickOutside);
  });

  const orderedAccounts = computed(() =>
    accounts.value.reduce((acc, item) => {
      if (item.status === 1) acc.unshift(item);
      else acc.push(item);

      return acc;
    }, [] as IAccount[])
  );
</script>
