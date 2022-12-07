<template>
  <div class="content">
    <h1 class="heading">{{ pageContent?.title }}</h1>

    <div v-if="pageContent?.questionList?.length">
      <expander
        v-for="(item, itemIndex) in pageContent.questionList"
        :key="itemIndex"
        :title="item.question"
        :content="item.answer"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { QuestionPageInterface } from '~/types';

  const pageContent = ref<QuestionPageInterface|undefined>(undefined);
  const globalStore = useGlobalStore();
  const { currentLocale } = storeToRefs(globalStore);
  const route = useRoute();
  const { pageUrl } = route.params;
  const contentRequest = await useAsyncData('pageContent', () => queryContent(`question/${currentLocale.value?.code}-${pageUrl}`).findOne());
  if (contentRequest.error.value) throw contentRequest.error.value;
  else pageContent.value = contentRequest.data.value as QuestionPageInterface;
</script>
