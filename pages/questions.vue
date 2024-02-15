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
  const globalStore = useGlobalStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);
  const { setPageSeo, getLocalesContentData } = useProjectMethods();

  const questionPageContent = ref<Maybe<IQuestionPage>>();
  const defaultLocaleQuestionsPageContent = ref<Maybe<IQuestionPage>>();
  const questionsCategoryData = ref<IQuestionCategory[]>([]);

  const checkRedirect = ():void => {
    const needRedirect = (route.name === 'questions' || route.name === 'locale-questions')
      && questionsCategoryData.value?.length;

    const router = useRouter();
    if (needRedirect) {
      router.replace(localizePath(`/questions/${questionsCategoryData.value[0]?.pageIdentity || 'most-popular'}`));
    }
  }

  interface IPageContent {
    currentLocaleData: Maybe<IQuestionPage>;
    defaultLocaleData: Maybe<IQuestionPage>;
    questionsCategoryData: Maybe<IQuestionCategory[]>;
  }

  const setContentData = (contentData: Maybe<IPageContent>): void => {
    questionPageContent.value = contentData?.currentLocaleData;
    defaultLocaleQuestionsPageContent.value = contentData?.defaultLocaleData;
    questionsCategoryData.value = contentData?.questionsCategoryData || [];
    setPageSeo(questionPageContent.value?.seo);
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const nuxtContentData = useNuxtData('questionPageContent');
    if (nuxtContentData.data.value) return nuxtContentData.data.value;

    const [currentLocaleQuestionPageContent, defaultLocaleQuestionPageContent, questionsContent] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'pages', 'question').findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'pages', 'question').findOne(),
      queryContent(currentLocale.value?.code as string, 'question-pages').find(),
    ]);
    const contentResponseData = getLocalesContentData(currentLocaleQuestionPageContent, defaultLocaleQuestionPageContent);
    const questionsCategoryData = questionsContent.status === 'fulfilled' ? questionsContent.value || [] : [];
    return reactive({ ...contentResponseData, questionsCategoryData });
  }

  const { pending, data } = await useLazyAsyncData('questionPageContent', () => getPageContent());
  if (data.value) setContentData(data.value);

  watch(data, () => {
    setContentData(data.value);
    checkRedirect();
  })

  onMounted(() => {
    checkRedirect();
  })
</script>

<style src="~/assets/styles/pages/questions.scss" lang="scss" />

