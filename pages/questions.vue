<template>
  <div>
    <div class="faq">
      <div class="header">
        <div class="title">{{ questionPageContent?.title || defaultLocaleQuestionsPageContent?.title || '' }}</div>
        <!--<div class="sub-title">Didn’t find an answer? Conact to or <a hef="#">Contact Support</a></div>-->
      </div>
      <nav-faq :items="listContent?.length ? listContent : defaultLocaleListContent"/>
      <NuxtPage />
    </div>

    <atomic-seo-text v-if="questionPageContent?.seo?.text" v-bind="questionPageContent.seo.text" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { QuestionPageInterface, QuestionPagesInterface } from '@skeleton/types';

  const { localizePath } = useProjectMethods();
  const route = useRoute();

  const listContent = ref<QuestionPageInterface[]>([]);
  const defaultLocaleListContent = ref<QuestionPageInterface[]>([]);
  const globalStore = useGlobalStore();
  const { currentLocale, defaultLocale, contentLocalesArray } = storeToRefs(globalStore);
  const {
    setPageSeo,
    findLocalesContentData,
  } = useProjectMethods();

  const [currentLocaleListRequest, defaultLocaleListRequest] = await Promise.all([
    useAsyncData('currentLocalePageList', () => queryContent(currentLocale.value?.code || '', 'question-pages').find()),
    useAsyncData('defaultLocalePageList', () => queryContent(currentLocale.value?.code || '', 'question-pages').find())
  ]);

  listContent.value = (currentLocaleListRequest.data.value as unknown) as QuestionPageInterface[];
  defaultLocaleListContent.value = (defaultLocaleListRequest.data.value as unknown) as QuestionPageInterface[];

  // const { currentLocaleData, defaultLocaleData } = findLocalesContentData(controlsRequest.data.value);
  // const questionPageContent: Maybe<QuestionPagesInterface> = currentLocaleData?.questionPage;
  // const defaultLocaleQuestionsPageContent: Maybe<QuestionPagesInterface> = defaultLocaleData?.questionPage;
  // setPageSeo(questionPageContent?.seo);

  if (route.name === 'questions' || route.name === 'locale-questions') {
    navigateTo(localizePath(`/questions/${listContent.value[0]?.pageUrl
      || defaultLocaleListContent.value[0]?.pageUrl
      || 'most-popular'}`), { replace: true });
  }
</script>

<style src="~/assets/styles/pages/questions.scss" lang="scss" />

