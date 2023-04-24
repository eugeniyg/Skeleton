<template>
  <div class="content">
    <div class="header">
      <h1 class="heading">{{ walletContent?.title || defaultLocaleWalletContent?.title }}</h1>

      <button-base
        id="open-currency-nav"
        type="secondary"
        size="md"
        :isDisabled="currencyNavEmpty"
        @click="openCurrNav"
      >
        <atomic-icon id="plus"/>{{ walletContent?.addButton || defaultLocaleWalletContent?.addButton }}
      </button-base>
    </div>

    <nav-currency :tabs="currencyTabs" @toggleNavEmpty="currencyNavEmpty = $event"/>

    <div class="cards-wallet">
      <TransitionGroup name="card">
        <card-wallet
          v-for="account in orderedAccounts"
          :key="account.id"
          v-bind="account"
          :content="walletContent || defaultLocaleWalletContent"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { AccountInterface } from '@platform/frontend-core/dist/module';
  import { ProfileWalletInterface } from '~/types';

  const globalStore = useGlobalStore();
  const { contentLocalesArray } = storeToRefs(globalStore);
  const {
    setPageSeo,
    findLocalesContentData,
  } = useProjectMethods();
  const walletContentRequest = await useAsyncData('walletContent', () => queryContent('profile')
    .where({ locale: { $in: contentLocalesArray.value } })
    .only(['locale', 'wallet']).find());
  const { currentLocaleData, defaultLocaleData } = findLocalesContentData(walletContentRequest.data.value);
  const walletContent: Maybe<ProfileWalletInterface> = currentLocaleData?.wallet;
  const defaultLocaleWalletContent: Maybe<ProfileWalletInterface> = defaultLocaleData?.wallet;
  setPageSeo(walletContent?.seo);

  const walletStore = useWalletStore();
  const { accounts, currencyTabs } = storeToRefs(walletStore);
  const layoutStore = useLayoutStore();
  const { isCurrencyNavOpen } = storeToRefs(layoutStore);
  const { openCurrencyNav, closeCurrencyNav } = layoutStore;
  const currencyNavEmpty = ref<boolean>(false);

  const openCurrNav = ():void => {
    openCurrencyNav();
  };

  const clickOutside = (e:any) => {
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

  const orderedAccounts = computed(() => accounts.value.reduce((acc, item) => {
    item.status === 1 ? acc.unshift(item) : acc.push(item);
    return acc;
  }, [] as AccountInterface[]));
</script>
