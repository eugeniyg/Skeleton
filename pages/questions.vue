<template>
  <div class="faq">
    <div class="header">
      <div class="title">{{ pageControls?.title || '' }}</div>
      <!--<div class="sub-title">Didn’t find an answer? Conact to or <a hef="#">Contact Support</a></div>-->
    </div>
    <nav-faq :items="listContent"/>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const { needToChangeLanguage, localizePath } = useProjectMethods();
  const route = useRoute();

  const listContent = ref([]);
  const pageControls = ref(undefined);
  const globalStore = useGlobalStore();
  const { currentLocale } = storeToRefs(globalStore);
  const listRequest = await useAsyncData('pageList', () => queryContent('question').where({ locale: currentLocale.value.code }).sort({ position: 1 }).find());
  const controlsRequest = await useAsyncData('pageControls', () => queryContent(`page-controls/${currentLocale.value.code}`).only(['questionPage']).findOne());
  listContent.value = listRequest.data.value;
  pageControls.value = controlsRequest.data.value?.questionPage;

  if (!needToChangeLanguage()) {
    if (route.path === localizePath('/questions')) {
      navigateTo(localizePath(`/questions/${listContent.value[0]?.pageUrl || 'most-popular'}`), { replace: true });
    }
  }
</script>

<style lang="scss" src="./questions/style.scss"/>
