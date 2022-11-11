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
  import { QuestionPageInterface, QuestionPagesInterface } from '~/types';

  const { localizePath } = useProjectMethods();
  const route = useRoute();

  const listContent = ref<QuestionPageInterface[]>([]);
  const globalStore = useGlobalStore();
  const { currentLocale } = storeToRefs(globalStore);
  const listRequest = await useAsyncData('pageList', () => queryContent('question').where({ locale: currentLocale.value?.code || 'en' }).sort({ position: 1 }).find());
  const controlsRequest = await useAsyncData('pageControls', () => queryContent(`page-controls/${currentLocale.value?.code}`).only(['questionPage']).findOne());
  listContent.value = (listRequest.data.value as unknown) as QuestionPageInterface[];
  const questionPageContent:QuestionPagesInterface|undefined = controlsRequest.data.value?.questionPage;
  const { setPageSeo } = useProjectMethods();
  setPageSeo(questionPageContent?.seo);

  if (route.name === 'questions' || route.name === 'locale-questions') {
    navigateTo(localizePath(`/questions/${listContent.value[0]?.pageUrl || 'most-popular'}`), { replace: true });
  }
</script>

<style lang="scss">
.faq {
  display: flex;
  grid-gap: rem(24px);
  flex-direction: column;
  position: relative;
  align-items: flex-start;

  > .header {
    display: grid;
    grid-gap: rem(8px);
    margin-bottom: rem(16px);
    grid-area: header;

    > .title {
      color: var(--color, var(--white));
      @include font($heading-7);
    }

    > .sub-title {
      color: var(--gray-400);
      @include font($body-2-paragraph);
    }

    a {
      color: var(--yellow-500);
    }
  }

  @include media(l) {
    grid-template-columns: auto 1px 1fr;
    grid-template-areas: "header header header" "nav vr content";
    display: grid;

    &:after {
      content: '';
      display: block;
      height: 100%;
      width: 1px;
      background-color: var(--gray-700);
      grid-area: vr;
    }
  }

  .nav-faq {
    grid-area: nav;
    width: 100%;
  }

  > .content {
    grid-area: content;
    display: grid;
    grid-gap: rem(24px);
    width: 100%;

    > .items {
      display: grid;
      grid-row-gap: rem(8px);
    }
  }

  .heading {
    color: var(--white);
    padding: 0;
    margin: 0;
    @include font($heading-5);

    &:first-of-type {
      @include upd-font($heading-6);
    }
  }
}
</style>
