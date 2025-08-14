<template>
  <div>
  <not-found v-if="pageNotFound"/>
  <transition name="fade" mode="out-in" v-else-if="lotteryData">
    <div class="lottery-page">
      <div class="lottery">
        <lottery-banner :lotteryData/>
        
        <lottery-prizes/>
        
        <lottery-steps/>
        
        <client-only>
          <lottery-tickets-types
            v-if="ticketPrices.length && showTicketsTypes"
            :items="ticketPrices"
          />
        </client-only>
        
        <terms-expander
          v-if="termsData?.title && termsData?.content"
          v-bind="termsData"
        />
        
        <atomic-seo-text
          v-if="lotteryPageContent?.pageMeta?.seoText"
          v-bind="lotteryPageContent.pageMeta.seoText"
        />
      </div>
    
    </div>
  </transition>
  </div>
</template>

<script setup lang="ts">
  import type { ILotteryCommon, ILotteryPage } from "~/types";
  import type { ILotteryTicketPrice } from '@skeleton/api/types';
  import { getLotteries } from '@skeleton/api/retention';
  
  const route = useRoute();
  const lotteryIdentity = route.params.lotteryIdentity as string;
  
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);
  
  const getLotteryData = async (): Promise<any> => {
    const { data } = await getLotteries(!isLoggedIn.value, {
      identity: [lotteryIdentity],
      state: [2, 3],
      currency: activeAccount.value?.currency
    });
    return data.length ? data[0] : undefined;
  };
  
  const pageContentParams = {
    contentCollection: 'lotteries',
    where: ['pageIdentity', '=', lotteryIdentity],
    isPage: true,
  };
  
  const lotteryCommonContentParams = {
    contentCollection: 'pages',
    contentSource: 'lotteries',
  };
  
  const { getContentData: getPageContent } = useContentLogic<ILotteryPage>(pageContentParams);
  const { getContentData: getCommonContent } = useContentLogic<ILotteryCommon>(lotteryCommonContentParams);
  
  const requestId = useId();
  const { data, status } = await useLazyAsyncData(
    requestId,
    async () => {
      const [lotteryPageContent, lotteryContent, lotteryData] = await Promise.all([
        getPageContent(),
        getCommonContent(),
        getLotteryData(),
      ]);
      
      const emptyContent = !lotteryPageContent.currentLocaleData && !lotteryContent?.defaultLocaleData;
      if (emptyContent || !lotteryData) throw createError({ statusCode: 404, statusMessage: 'Lottery Not Found' });
      return { lotteryPageContent, lotteryContent, lotteryData };
    },
    {
      deep: true,
    }
  );

  const lotteryPageContent = computed(() => data.value?.lotteryPageContent?.currentLocaleData);
  const lotteryPageDefaultContent = computed(() => data.value?.lotteryPageContent?.defaultLocaleData);
  const lotteryContent = computed(() => data.value?.lotteryContent?.currentLocaleData);
  const lotteryDefaultContent = computed(() => data.value?.lotteryContent?.defaultLocaleData);
  
  provide('lotteryPageContent', lotteryPageContent);
  provide('lotteryPageDefaultContent', lotteryPageDefaultContent);
  provide('lotteryContent', lotteryContent);
  provide('lotteryDefaultContent', lotteryDefaultContent);
  
  const lotteryData = computed(() => data.value?.lotteryData);
  
  const ticketPrices = computed(() => {
    return lotteryData.value?.ticketPrices || [];
  });
  
  const showTicketsTypes = computed(() => {
    const currency = activeAccount.value?.currency;
    
    const pricesForCurrency = lotteryData.value?.ticketPrices?.filter(
      (item: ILotteryTicketPrice) => item.isoCode === currency || item.isoCode === null
    ) || [];
    
    return (
      isLoggedIn.value &&
      currency &&
      lotteryData.value?.currencies?.includes(currency) &&
      pricesForCurrency.length > 1
    );
  });
  
  const pageNotFound = computed(() => {
    const emptyContent = !lotteryPageContent.value && !lotteryPageDefaultContent.value;
    const lotteryNotFound = !lotteryData.value;
    return ['error', 'success'].includes(status.value) && (emptyContent || lotteryNotFound);
  });
  
  const termsData = computed<{ title: string; content: string } | undefined>(() => {
    const currentLocaleTerms = getContent(lotteryPageContent.value, lotteryPageDefaultContent.value, 'terms');
    if (currentLocaleTerms?.title && currentLocaleTerms?.content) return currentLocaleTerms;
    return undefined;
  });
  
  const updateLotteryData = async (): Promise<void> => {
    if (data.value && isLoggedIn.value) {
      data.value.lotteryData = await getLotteryData();
    }
  };
  
  watch(isLoggedIn, updateLotteryData);
  watch(activeAccount, updateLotteryData);
</script>