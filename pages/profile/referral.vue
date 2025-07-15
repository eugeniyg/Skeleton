<template>
  <div class="referral">
    <div class="referral__title">{{ getContent(currentLocaleContent, defaultLocaleContent, 'title') }}</div>

    <referral-info />

    <referral-card :total-count="referralsList.length" />

    <referral-how-it-works v-if="isHowItWorksExist" />

    <referral-rewards v-if="referralsList.length && !isLoading" :referralsList :pageMeta @change-Page="changePage" />

    <referral-faq v-if="isFaqExist" />
  </div>
</template>

<script setup lang="ts">
  import type { IProfileReferral } from '~/types';
  import type { IPaginationMeta, IReferralItem, IReferralsRequest } from '@skeleton/core/types';
  
  const { getContent } = useProjectMethods();
  const { getPlayerReferrals } = useCoreProfileApi();
  
  const referralsList = ref<IReferralItem[]>([]);
  const pageMeta = ref<Maybe<IPaginationMeta>>(undefined);
  const isLoading = ref(false);
  
  definePageMeta({
    middleware: async function (to) {
      const { localizePath } = useProjectMethods();
      const { settingsConstants } = useGlobalStore();
      if (!settingsConstants?.player?.referral?.enabled) {
        return navigateTo({ path: localizePath(`/profile/info`), query: { ...to.query } });
      }
    },
  });

  const contentParams = {
    contentKey: 'profileReferralContent',
    contentRoute: ['profile', 'referral'],
    isPage: true,
  };
  const { getContentData } = useContentLogic<IProfileReferral>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(getContentData);

  const currentLocaleContent = computed(() => pageContent.value?.currentLocaleData);
  const defaultLocaleContent = computed(() => pageContent.value?.defaultLocaleData);

  provide('referralContent', currentLocaleContent);
  provide('defaultLocaleReferralContent', defaultLocaleContent);

  const isHowItWorksExist = computed(() => {
    const content = getContent(currentLocaleContent.value, defaultLocaleContent.value, 'howItWorks');
    return content?.items?.length;
  });

  const isFaqExist = computed(() => {
    const content = getContent(currentLocaleContent.value, defaultLocaleContent.value, 'faq');
    return content?.items?.length;
  });

  const getReferralsData = async (page = 1): Promise<void> => {
    isLoading.value = true;
    const requestParams: IReferralsRequest = {
      page,
      perPage: 100,
    };
    try {
      const { referrals, meta } = await getPlayerReferrals(requestParams);
      referralsList.value = referrals;
      pageMeta.value = meta;
    } catch {
      console.error('Failed to load referrals data');
    }
    isLoading.value = false;
  };

  const changePage = async (page: number): Promise<void> => {
    if (isLoading.value) return;
    await getReferralsData(page);
  };

  onMounted(getReferralsData);
</script>

<style src="~/assets/styles/pages/profile/referral.scss" lang="scss" />
