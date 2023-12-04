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

  const route = useRoute();
  const { pageUrl } = route.params;

  const globalStore = useGlobalStore();
  const { currentLocale } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();

  const pageContent = ref<Maybe<IQuestionCategory>>();

  const setContentData = (contentData: Maybe<IQuestionCategory>): void => {
    if (contentData) {
      pageContent.value = contentData;
    } else {
      throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
    }
  }

  const getPageContent = async (): Promise<IQuestionCategory> => {
    const nuxtContentData = useNuxtData(`${pageUrl}-question`);
    if (nuxtContentData.data.value) return nuxtContentData.data.value;

    const pageContent: object = await queryContent(currentLocale.value?.code as string, 'question-pages', pageUrl as string).findOne();
    return reactive({ ...pageContent } as IQuestionCategory);
  }

  const { pending, data, error } = await useLazyAsyncData(`${pageUrl}-question`, () => getPageContent());
  if (error.value) throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
  else if (data.value) setContentData(data.value);

  watch(data, () => {
    setContentData(data.value);
  })

  const questionsList = computed(() => {
    return pageContent.value?.questionList || [];
  });
</script>
