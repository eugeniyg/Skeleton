<template>
  <not-found v-if="pageNotFound" />

  <div v-else-if="data" class="wheel-page">
    <div class="wheel-page__head">
      <h1 class="wheel-page__title">title</h1>
      <h2 class="wheel-page__subtitle">subtitle</h2>
    </div>

    <wheel-general
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
</template>

<script setup lang="ts">
  import type { IWheelPage, IWheelCommon } from '~/types';

  const route = useRoute();
  const wheelIdentity = route.params.identity as string;

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
  const { data, status } = await useLazyAsyncData(() => Promise.all([getWheelPageContent(), getWheelCommonContent()]));

  const wheelPageContent = computed(() => data.value?.[0]);
  const wheelCommonContent = computed(() => data.value?.[1]);
  const pageNotFound = computed(() => {
    const emptyContent = !wheelPageContent.value?.currentLocaleData && !wheelPageContent.value?.defaultLocaleData;
    return ['error', 'success'].includes(status.value) && emptyContent;
  });

  const { getContent } = useProjectMethods();
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
</script>

<style src="~/assets/styles/pages/wheel.scss" lang="scss" />
