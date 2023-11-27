<template>
  <div>
    <div class="faq">
      <div class="header">
        <div class="title">{{ questionPageContent?.title || defaultLocaleQuestionsPageContent?.title || '' }}</div>
        <!--<div class="sub-title">Didn’t find an answer? Conact to or <a hef="#">Contact Support</a></div>-->
      </div>
      <nav-faq :items="questionsCategoryData" />
      <NuxtPage />
    </div>

    <atomic-seo-text v-if="questionPageContent?.seo?.text" v-bind="questionPageContent.seo.text" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IQuestionPage } from '~/types';

  const { localizePath } = useProjectMethods();
  const route = useRoute();

  const globalStore = useGlobalStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);
  const { setPageSeo, getLocalesContentData } = useProjectMethods();

  let questionPageContent: Maybe<IQuestionPage>;
  let defaultLocaleQuestionsPageContent: Maybe<IQuestionPage>;
  let questionsCategoryData;
  const [nuxtCurrentLocaleData, nuxtDefaultLocaleData, nuxtQuestionCategoryData] = [
    useNuxtData('currentLocaleQuestionPageContent'),
    useNuxtData('defaultLocaleQuestionPageContent'),
    useNuxtData('questionsContent')
  ]

  if (nuxtCurrentLocaleData.data.value || nuxtDefaultLocaleData.data.value || nuxtQuestionCategoryData.data.value) {
    questionPageContent = nuxtCurrentLocaleData.data.value;
    defaultLocaleQuestionsPageContent = nuxtDefaultLocaleData.data.value;
    questionsCategoryData = nuxtQuestionCategoryData.data.value || [];
  } else {
    const [currentLocaleQuestionPageContent, defaultLocaleQuestionPageContent, questionsContent] = await Promise.allSettled([
      useAsyncData('currentLocaleQuestionPageContent', () => queryContent(currentLocale.value?.code as string, 'pages', 'question').findOne()),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : useAsyncData('defaultLocaleQuestionPageContent', () => queryContent(defaultLocale.value?.code as string, 'pages', 'question').findOne()),
      useAsyncData('questionsContent', () => queryContent(currentLocale.value?.code as string, 'question-pages').find()),
    ]);

    const responseContentData = getLocalesContentData(currentLocaleQuestionPageContent, defaultLocaleQuestionPageContent);
    questionPageContent = responseContentData.currentLocaleData;
    defaultLocaleQuestionsPageContent = responseContentData.defaultLocaleData;
    questionsCategoryData = questionsContent.status === 'fulfilled' ? questionsContent.value.data?.value || [] : [];
  }

  setPageSeo(questionPageContent?.seo);

  if ((route.name === 'questions' || route.name === 'locale-questions') && questionsCategoryData?.length) {
    navigateTo(localizePath(`/questions/${questionsCategoryData[0]?.pageUrl || 'most-popular'}`), { replace: true });
  }
</script>

<style src="~/assets/styles/pages/questions.scss" lang="scss" />

