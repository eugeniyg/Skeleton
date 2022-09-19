<template>
  <div>
    <div class="faq">
      <div class="header">
        <div class="title">{{ questionPageContent?.title || '' }}</div>
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
  import { QuestionPagesInterface } from '~/types';

  const { needToChangeLanguage, localizePath } = useProjectMethods();
  const route = useRoute();

  const listContent = ref([]);
  const globalStore = useGlobalStore();
  const { currentLocale } = storeToRefs(globalStore);
  const listRequest = await useAsyncData('pageList', () => queryContent('question').where({ locale: currentLocale.value.code }).sort({ position: 1 }).find());
  const controlsRequest = await useAsyncData('pageControls', () => queryContent(`page-controls/${currentLocale.value.code}`).only(['questionPage']).findOne());
  listContent.value = listRequest.data.value;
  const questionPageContent:QuestionPagesInterface|undefined = controlsRequest.data.value?.questionPage;
  const { setPageSeo } = useProjectMethods();
  setPageSeo(questionPageContent?.seo);

  if (!needToChangeLanguage()) {
    if (route.path === localizePath('/questions')) {
      navigateTo(localizePath(`/questions/${listContent.value[0]?.pageUrl || 'most-popular'}`), { replace: true });
    }
  }
</script>

<style lang="scss" src="./questions/style.scss"/>
