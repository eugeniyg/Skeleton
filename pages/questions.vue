<template>
  <div>
    <div class="faq">
      <div class="header">
        <div class="title">
          {{ pageContent?.currentLocaleData?.title || pageContent?.defaultLocaleData?.title || '' }}
        </div>
      </div>

      <nav-faq v-if="categoryContent?.currentLocaleData?.length" :items="categoryContent?.currentLocaleData" />

      <NuxtPage />
    </div>

    <atomic-seo-text
      v-if="pageContent?.currentLocaleData?.pageMeta?.seoText"
      v-bind="pageContent.currentLocaleData.pageMeta.seoText"
    />
  </div>
</template>

<script setup lang="ts">
  import type { IQuestionCategory, IQuestionPage } from '~/types';

  definePageMeta({
    middleware: [
      function (to, from) {
        if (
          (from.name === 'questions-pageIdentity' && to.name === 'questions') ||
          (from.name === 'locale-questions-pageIdentity' && to.name === 'locale-questions')
        ) {
          return abortNavigation();
        }
      },
    ],
  });

  const route = useRoute();
  const pageContentParams = {
    contentKey: 'questionPageContent',
    contentRoute: ['pages', 'question'],
    isPage: true,
  };
  const { getContentData: getPageContentData } = useContentLogic<IQuestionPage>(pageContentParams);
  const { data: pageContent } = await useLazyAsyncData(getPageContentData);

  const categoryContentParams = {
    contentKey: 'questionCategoryContent',
    contentRoute: ['question-pages'],
    findAll: true,
  };
  const { getContentData: getCategoryContentData } = useContentLogic<IQuestionCategory[]>(categoryContentParams);
  const { data: categoryContent } = await useLazyAsyncData(getCategoryContentData);

  const checkRedirect = (): void => {
    const needRedirect =
      (route.name === 'questions' || route.name === 'locale-questions') &&
      categoryContent.value?.currentLocaleData?.length;

    const router = useRouter();
    if (needRedirect) {
      router.replace(
        localizePath(`/questions/${categoryContent.value?.currentLocaleData?.[0]?.pageIdentity || 'most-popular'}`)
      );
    }
  };

  watch(
    () => categoryContent.value?.currentLocaleData,
    newValue => {
      if (newValue) checkRedirect();
    },
    { immediate: true }
  );
</script>

<style src="~/assets/styles/pages/questions.scss" lang="scss" />
