<template>
  <div>
    <div class="faq">
      <div class="header">
        <div class="title">{{ currentLocaleContent?.title || defaultLocaleContent?.title || '' }}</div>
      </div>

      <nav-faq v-if="categoryContentData?.length" :items="categoryContentData" />

      <NuxtPage />
    </div>

    <atomic-seo-text v-if="currentLocaleContent?.pageMeta?.seoText" v-bind="currentLocaleContent.pageMeta.seoText" />
  </div>
</template>

<script setup lang="ts">
  import type { IQuestionCategory, IQuestionPage } from '~/types';

  definePageMeta({
    middleware: [
      function (to, from) {
        if ((from.name === 'questions-pageIdentity' && to.name === 'questions')
          || (from.name === 'locale-questions-pageIdentity' && to.name === 'locale-questions')) {
          return abortNavigation();
        }
      },
    ],
  });

  const route = useRoute();
  const { localizePath } = useProjectMethods();

  const { currentLocaleContent, defaultLocaleContent } = await useContentLogic<IQuestionPage>({
    contentKey: 'questionPageContent',
    contentRoute: ['pages', 'question'],
    isPage: true
  })

  const { currentLocaleContent: categoryContentData } = await useContentLogic<IQuestionCategory[]>({
    contentKey: 'questionCategoryContent',
    contentRoute: ['question-pages'],
    findAll: true
  })

  const checkRedirect = ():void => {
    const needRedirect = (route.name === 'questions' || route.name === 'locale-questions')
      && categoryContentData.value?.length;

    const router = useRouter();
    if (needRedirect) {
      router.replace(localizePath(`/questions/${categoryContentData.value?.[0]?.pageIdentity || 'most-popular'}`));
    }
  }

  watch(categoryContentData, (newValue) => {
    if (newValue) checkRedirect();
  }, { immediate: true });
</script>

<style src="~/assets/styles/pages/questions.scss" lang="scss" />

