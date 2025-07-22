<template>
  <div class="content">
    <h1 class="heading">{{ categoryContent?.currentLocaleData?.title }}</h1>

    <div v-if="questionsList.length">
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
  import type { IQuestionCategory } from '~/types';

  const route = useRoute();
  const { pageIdentity } = route.params;

  const contentParams = {
    contentKey: `${pageIdentity}-question`,
    contentCollection: 'question-pages',
    where: ['pageIdentity', '=', pageIdentity],
    currentOnly: true,
  };
  const { getContentData } = useContentLogic<IQuestionCategory>(contentParams);
  const { data: categoryContent } = await useLazyAsyncData(contentParams.contentKey, getContentData);

  const questionsList = computed(() => {
    return categoryContent.value?.currentLocaleData?.questionList || [];
  });
</script>
