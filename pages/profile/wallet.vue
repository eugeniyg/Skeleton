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

    <div v-if="walletContent || defaultLocaleWalletContent" class="cards-wallet">
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
  import type { IAccount } from '@skeleton/core/types';
  import type { IProfileWallet } from '~/types';

  const globalStore = useGlobalStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);
  const {
    setPageSeo,
    getLocalesContentData,
  } = useProjectMethods();

  const walletContent = ref<Maybe<IProfileWallet>>();
  const defaultLocaleWalletContent = ref<Maybe<IProfileWallet>>();

  interface IPageContent {
    currentLocaleData: Maybe<IProfileWallet>;
    defaultLocaleData: Maybe<IProfileWallet>;
  }

  const setContentData = (contentData: Maybe<IPageContent>): void => {
    walletContent.value = contentData?.currentLocaleData;
    defaultLocaleWalletContent.value = contentData?.defaultLocaleData;
    setPageSeo(walletContent.value?.seo);
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const nuxtContentData = useNuxtData('profileWalletContent');
    if (nuxtContentData.data.value) return nuxtContentData.data.value;

    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'profile', 'wallet').findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'profile', 'wallet').findOne()
    ]);
    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  }

  const { pending, data } = await useLazyAsyncData('profileWalletContent', () => getPageContent());
  if (data.value) setContentData(data.value);

  watch(data, () => {
    setContentData(data.value);
  })

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
  }, [] as IAccount[]));
</script>
