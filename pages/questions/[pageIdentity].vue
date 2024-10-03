<template>
  <div class="content">
    <h1 class="heading">{{ currentLocaleContent?.title }}</h1>

    <div v-if="currentLocaleContent?.questionList?.length">
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

  const { currentLocaleContent } = await useContentLogic<IQuestionCategory>({
    contentKey: `${pageIdentity}-question`,
    contentRoute: ['question-pages'],
    where: { pageIdentity }
  });

  const questionsList = computed(() => {
    return currentLocaleContent.value?.questionList || [];
  });
</script>
