<template>
  <div class="content">
    <h1 class="heading">{{ pageContent?.title }}</h1>

    <div v-if="pageContent?.questionList?.length">
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
  import type { IQuestionCategory } from '~/types';

  const pageContent = ref<IQuestionCategory|undefined>(undefined);
  const route = useRoute();
  const { pageUrl } = route.params;

  const globalStore = useGlobalStore();
  const { currentLocale } = storeToRefs(globalStore);

  const { getContent } = useProjectMethods();
  const { data: { value: questionPageContent } }: { data: { value: IQuestionCategory }} = await useAsyncData(`${pageUrl}-question`,
    () => queryContent(currentLocale.value?.code as string, 'question-pages', pageUrl as string).findOne());

  if (questionPageContent) {
    pageContent.value = questionPageContent;
  } else {
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
  }

  const questionsList = computed(() => {
    return pageContent.value?.questionList || [];
  });
</script>
