<template>
  <div class="wheel-page__container">
    <not-found v-if="pageNotFound" />

    <div v-else-if="wheelData" class="wheel-page">
      <div class="wheel-page__head">
        <h1 class="wheel-page__title">{{ wheelData?.title }}</h1>
        <h2 class="wheel-page__subtitle">{{ pageSubtitle }}</h2>
      </div>

      <wheel-general
        :wheelData="wheelData as IWheel"
        :currentLocalePageContent="wheelPageContent?.currentLocaleData"
        :defaultLocalePageContent="wheelPageContent?.defaultLocaleData"
        :currentLocaleCommonContent="wheelCommonContent?.currentLocaleData"
        :defaultLocaleCommonContent="wheelCommonContent?.defaultLocaleData"
      />

      <how-it-works
        :currentLocaleContent="wheelCommonContent?.currentLocaleData?.howItWorks"
        :defaultLocaleContent="wheelCommonContent?.defaultLocaleData?.howItWorks"
      />

      <terms-expander :title="termsTitle" :content="termsContent" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IWheelPage, IWheelCommon } from '~/types';
  import type { IWheel } from '@skeleton/core/types/wheelsTypes';

  const route = useRoute();
  const wheelIdentity = route.params.wheelIdentity as string;

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);

  const { getWheels } = useCoreWheelsApi();
  const getWheelData = async (): Promise<IWheel | undefined> => {
    const { data } = await getWheels(!isLoggedIn.value, {
      identity: [wheelIdentity],
      state: [2, 3],
    });
    return data.length ? data[0] : undefined;
  };

  const wheelPageContentParams = {
    contentKey: `wheel-${wheelIdentity}`,
    contentRoute: ['wheels', wheelIdentity],
    isPage: true,
  };
  const wheelCommonContentParams = {
    contentKey: `wheels-common`,
    contentRoute: ['pages', 'wheel'],
  };
  const { getContentData: getWheelPageContent } = useContentLogic<IWheelPage>(wheelPageContentParams);
  const { getContentData: getWheelCommonContent } = useContentLogic<IWheelCommon>(wheelCommonContentParams);
  const nuxtApp = useNuxtApp();
  if (!nuxtApp.isHydrating) clearNuxtData('wheel-page');
  const { data, status } = await useLazyAsyncData(
    `wheel-page`,
    async () => {
      const [wheelPageContent, wheelCommonContent, wheelData] = await Promise.all([
        getWheelPageContent(),
        getWheelCommonContent(),
        getWheelData(),
      ]);
      return { wheelPageContent, wheelCommonContent, wheelData };
    },
    {
      deep: true,
    }
  );

  const wheelPageContent = computed(() => data.value?.wheelPageContent);
  const wheelCommonContent = computed(() => data.value?.wheelCommonContent);
  const wheelData = computed(() => data.value?.wheelData);
  const pageNotFound = computed(() => {
    const emptyContent = !wheelPageContent.value?.currentLocaleData && !wheelPageContent.value?.defaultLocaleData;
    const wheelNotFound = !wheelData.value;
    return ['error', 'success'].includes(status.value) && (emptyContent || wheelNotFound);
  });

  const { getContent } = useProjectMethods();
  const pageSubtitle = computed(() =>
    getContent(wheelPageContent.value?.currentLocaleData, wheelPageContent.value?.defaultLocaleData, 'pageSubtitle')
  );
  const termsTitle = computed(() =>
    getContent(wheelCommonContent.value?.currentLocaleData, wheelCommonContent.value?.defaultLocaleData, 'terms.title')
  );
  const termsContent = computed(() =>
    getContent(
      wheelCommonContent.value?.currentLocaleData,
      wheelCommonContent.value?.defaultLocaleData,
      'terms.content'
    )
  );

  const updateWheelData = async (): Promise<void> => {
    if (data.value && isLoggedIn.value) {
      data.value.wheelData = await getWheelData();
    }
  };

  watch(isLoggedIn, updateWheelData);

  onMounted(() => {
    updateWheelData();
  });
</script>

<style src="~/assets/styles/pages/wheel.scss" lang="scss" />
