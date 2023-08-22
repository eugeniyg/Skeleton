<template>
  <div class="content">
    <h1 class="heading">{{ pageContent?.title || defaultLocalePageContent?.title }}</h1>

    <div v-if="getContent(pageContent, defaultLocalePageContent, 'questionList')?.length">
      <expander
        v-for="(item, itemIndex) in questionsList"
        :key="itemIndex"
        :title="item.question"
        :content="item.answer"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { QuestionPageInterface } from '@skeleton/types';

  const pageContent = ref<QuestionPageInterface|undefined>(undefined);
  const defaultLocalePageContent = ref<QuestionPageInterface|undefined>(undefined);
  const route = useRoute();
  const { pageUrl } = route.params;

  const globalStore = useGlobalStore();
  const { contentLocalesArray, currentLocale } = storeToRefs(globalStore);

  const { findLocalesContentData, getContent } = useProjectMethods();
  const contentRequest = await useAsyncData('questionsPageContent', () => queryContent(currentLocale.value?.code || '', 'question-pages', pageUrl as string).findOne());

  if (contentRequest.error.value) {
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
  } else {
    // const { currentLocaleData, defaultLocaleData } = findLocalesContentData(contentRequest.data.value);
    pageContent.value = contentRequest.data.value;
    defaultLocalePageContent.value = contentRequest.data.value;
  }

  const questionsList = computed(() => {
    if (pageContent.value?.questionList?.length) return pageContent.value.questionList;
    return defaultLocalePageContent.value?.questionList || [];
  });
</script>
