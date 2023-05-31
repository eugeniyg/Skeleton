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
  const { contentLocalesArray } = storeToRefs(globalStore);

  const { findLocalesContentData, getContent } = useProjectMethods();
  const contentRequest = await useAsyncData('questionsPageContent', () => queryContent('question')
    .where({ locale: { $in: contentLocalesArray.value }, pageUrl }).find());

  if (contentRequest.error.value || !contentRequest.data.value?.length) {
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
  } else {
    const { currentLocaleData, defaultLocaleData } = findLocalesContentData(contentRequest.data.value);
    pageContent.value = currentLocaleData as QuestionPageInterface;
    defaultLocalePageContent.value = defaultLocaleData as QuestionPageInterface;
  }

  const questionsList = computed(() => {
    if (pageContent.value?.questionList?.length) return pageContent.value.questionList;
    return defaultLocalePageContent.value?.questionList || [];
  });
</script>
