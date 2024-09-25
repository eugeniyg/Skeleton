<template>
  <div class="content">
    <div class="header">
      <h1 class="heading">
        {{ content?.currentLocaleData?.title || content?.defaultLocaleData?.title }}
      </h1>

      <button-base
        id="open-currency-nav"
        type="secondary"
        size="md"
        :isDisabled="currencyNavEmpty"
        @click="openCurrNav"
      >
        <atomic-icon id="plus"/>{{ content?.currentLocaleData?.addButton || content?.defaultLocaleData?.addButton }}
      </button-base>
    </div>

    <nav-currency :tabs="currencyTabs" @toggleNavEmpty="currencyNavEmpty = $event"/>

    <div v-if="content?.currentLocaleData || content?.defaultLocaleData" class="cards-wallet">
      <TransitionGroup name="card">
        <card-wallet
          v-for="account in orderedAccounts"
          :key="account.id"
          v-bind="account"
          :content="content?.currentLocaleData || content?.defaultLocaleData"
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
    setPageMeta,
    getLocalesContentData,
  } = useProjectMethods();

  interface IPageContent {
    currentLocaleData: Maybe<IProfileWallet>;
    defaultLocaleData: Maybe<IProfileWallet>;
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const { data } = useNuxtData('profileWalletContent');
    if (data.value) return data.value;

    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'profile', 'wallet').findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
      : queryContent(defaultLocale.value?.code as string, 'profile', 'wallet').findOne()
    ]);

    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  }

  const { data: content } = await useLazyAsyncData('profileWalletContent', () => getPageContent());

  watch(content, () => {
    if (content.value) setPageMeta(content.value?.currentLocaleData?.pageMeta);
  }, { immediate: true })

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
