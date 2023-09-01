<template>
  <div>
    <div class="faq">
      <div class="header">
        <div class="title">{{ questionPageContent?.title || defaultLocaleQuestionsPageContent?.title || '' }}</div>
        <!--<div class="sub-title">Didn’t find an answer? Conact to or <a hef="#">Contact Support</a></div>-->
      </div>
      <nav-faq :items="listContent"/>
      <NuxtPage />
    </div>

    <atomic-seo-text v-if="questionPageContent?.seo?.text" v-bind="questionPageContent.seo.text" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { IQuestionPage } from '~/types';

  const { localizePath } = useProjectMethods();
  const route = useRoute();

  const globalStore = useGlobalStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);
  const { setPageSeo, getLocalesContentData } = useProjectMethods();

  const [currentLocaleQuestionPageContent, defaultLocaleQuestionPageContent, questionsContent] = await Promise.allSettled([
    useAsyncData('currentLocaleQuestionPageContent', () => queryContent(currentLocale.value?.code as string, 'pages', 'question').findOne()),
    currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
      : useAsyncData('defaultLocaleQuestionPageContent', () => queryContent(defaultLocale.value?.code as string, 'pages', 'question').findOne()),
    useAsyncData('questionsContent', () => queryContent(currentLocale.value?.code as string, 'question-pages').find()),
  ]);

  const { currentLocaleData, defaultLocaleData } = getLocalesContentData(currentLocaleQuestionPageContent, defaultLocaleQuestionPageContent);
  const questionPageContent: Maybe<IQuestionPage> = currentLocaleData;
  const defaultLocaleQuestionsPageContent: Maybe<IQuestionPage> = defaultLocaleData;
  setPageSeo(questionPageContent?.seo);

  const listContent = questionsContent.status === 'fulfilled'
    ? questionsContent.value.data?.value || [] : [];

  if (route.name === 'questions' || route.name === 'locale-questions') {
    navigateTo(localizePath(`/questions/${listContent[0]?.pageUrl || 'most-popular'}`), { replace: true });
  }
</script>

<style src="~/assets/styles/pages/questions.scss" lang="scss" />

