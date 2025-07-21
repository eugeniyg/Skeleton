<template>
  <div class="wheel-page__container">
    <transition name="fade" mode="out-in">
      <div v-if="status === 'pending' || getPlayerSpins" class="wheel-page__spinner">
        <div class="wheel-page__spinner-border">
          <div class="wheel-page__spinner-core" />
        </div>
      </div>

      <not-found v-else-if="pageNotFound" />

      <div v-else-if="wheelData" class="wheel-page">
        <wheel-general
          :wheelData="wheelData as IWheel"
          :currentLocalePageContent="wheelPageContent?.currentLocaleData"
          :defaultLocalePageContent="wheelPageContent?.defaultLocaleData"
          :currentLocaleCommonContent="wheelCommonContent?.currentLocaleData"
          :defaultLocaleCommonContent="wheelCommonContent?.defaultLocaleData"
          @updateWheel="updateWheelData"
        />

        <how-it-works
          v-if="showHowItWorks"
          :currentLocaleContent="wheelPageContent?.currentLocaleData?.howItWorks"
          :defaultLocaleContent="wheelPageContent?.defaultLocaleData?.howItWorks"
        />

        <terms-expander v-if="showTerms" :title="termsTitle" :content="termsContent" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import type { IWheelPage, IWheelCommon } from '~/types';
  import type { IWheel } from '@skeleton/api/types';
  import { getWheels } from '@skeleton/api/retention';

  const route = useRoute();
  const wheelIdentity = route.params.wheelIdentity as string;

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);

  const getWheelData = async (): Promise<IWheel | undefined> => {
    const { data } = await getWheels(!isLoggedIn.value, {
      identity: [wheelIdentity],
      state: [2, 3],
    });
    return data.length ? data[0] : undefined;
  };

  const wheelPageContentParams = {
    contentKey: `wheel-${wheelIdentity}`,
    contentCollection: 'wheels',
    where: ['pageIdentity', '=', wheelIdentity],
    isPage: true,
  };
  const wheelCommonContentParams = {
    contentKey: `wheels-common`,
    contentCollection: 'pages',
    contentSource: 'wheel',
  };
  const { getContentData: getWheelPageContent } = useContentLogic<IWheelPage>(wheelPageContentParams);
  const { getContentData: getWheelCommonContent } = useContentLogic<IWheelCommon>(wheelCommonContentParams);
  const requestId = useId();
  const { data, status, error } = await useLazyAsyncData(
    requestId,
    async () => {
      const [wheelPageContent, wheelCommonContent, wheelData] = await Promise.all([
        getWheelPageContent(),
        getWheelCommonContent(),
        getWheelData(),
      ]);
      const emptyContent = !wheelPageContent.currentLocaleData && !wheelPageContent?.defaultLocaleData;
      if (emptyContent || !wheelData) throw createError({ statusCode: 404, statusMessage: 'Wheel Not Found' });
      return { wheelPageContent, wheelCommonContent, wheelData };
    },
    {
      deep: true,
    }
  );

  if (error.value) throw createError(error.value);

  const wheelPageContent = computed(() => data.value?.wheelPageContent);
  const wheelCommonContent = computed(() => data.value?.wheelCommonContent);
  const wheelData = computed(() => data.value?.wheelData);
  const pageNotFound = computed(() => {
    const emptyContent = !wheelPageContent.value?.currentLocaleData && !wheelPageContent.value?.defaultLocaleData;
    const wheelNotFound = !wheelData.value;
    return ['error', 'success'].includes(status.value) && (emptyContent || wheelNotFound);
  });

  const showHowItWorks = computed(() =>
    getContent(
      wheelPageContent.value?.currentLocaleData,
      wheelPageContent.value?.defaultLocaleData,
      'howItWorks.enabled'
    )
  );
  const showTerms = computed(() =>
    getContent(wheelPageContent.value?.currentLocaleData, wheelPageContent.value?.defaultLocaleData, 'terms.enabled')
  );
  const termsTitle = computed(() =>
    getContent(wheelPageContent.value?.currentLocaleData, wheelPageContent.value?.defaultLocaleData, 'terms.title')
  );
  const termsContent = computed(() =>
    getContent(wheelPageContent.value?.currentLocaleData, wheelPageContent.value?.defaultLocaleData, 'terms.content')
  );

  const updateWheelData = async (): Promise<void> => {
    if (data.value && isLoggedIn.value) {
      data.value.wheelData = await getWheelData();
    }
  };

  watch(isLoggedIn, updateWheelData);

  const checkSpinsIssued = async (eventWheelIdentity: string): Promise<void> => {
    if (eventWheelIdentity === wheelIdentity) await updateWheelData();
  };

  const getPlayerSpins = ref(false);
  onMounted(async () => {
    if (data.value && isLoggedIn.value) {
      getPlayerSpins.value = true;
      data.value.wheelData = await getWheelData();
      getPlayerSpins.value = false;
    }

    useListen('wheelSpinsIssued', checkSpinsIssued);
  });

  onBeforeUnmount(() => {
    useUnlisten('wheelSpinsIssued', checkSpinsIssued);
  });
</script>

<style src="~/assets/styles/pages/wheel.scss" lang="scss" />
