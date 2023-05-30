<template>
  <div class="sbt-token">
    <div class="container">
      <iframe
        src="https://widget.trueplay.io/new/?demo=true&operator=slotsbet&tokenName=SBT"
        height="100%"
        width="100%"
      />
    </div>
    <atomic-seo-text v-if="tokenContent?.seo?.text" v-bind="tokenContent?.seo?.text" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { TokenContentInterface } from '@skeleton/types';

  const globalStore = useGlobalStore();
  const { contentLocalesArray } = storeToRefs(globalStore);
  const { setPageSeo, findLocalesContentData } = useProjectMethods();
  const tokenContentRequest = await useAsyncData('tokenContent', () => queryContent('page-controls')
    .where({ locale: { $in: contentLocalesArray.value } }).only(['locale', 'tokenPage']).find());
  const { currentLocaleData } = findLocalesContentData(tokenContentRequest.data.value);
  const tokenContent: Maybe<TokenContentInterface> = currentLocaleData?.tokenPage;
  setPageSeo(tokenContent?.seo);
</script>

<style src="~/assets/styles/pages/sbt-token.scss" lang="scss" />

