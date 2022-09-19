<template>
  <div class="sbt-token">
    <div class="container">
      <iframe
        src="https://widget.true-play.io/?demo=true&operator=slotsbet&tokenName=SBT"
        height="100%"
        width="100%"
      />
    </div>
    <atomic-seo-text v-if="tokenContent?.seo?.text" v-bind="tokenContent?.seo?.text" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { TokenContentInterface } from '~/types';

  const globalStore = useGlobalStore();
  const { currentLocale } = storeToRefs(globalStore);
  const tokenContentRequest = await useAsyncData('tokenContent', () => queryContent(`page-controls/${currentLocale.value.code}`).only(['tokenPage']).findOne());
  const tokenContent:TokenContentInterface|undefined = tokenContentRequest.data.value?.tokenPage;
  const { setPageSeo } = useProjectMethods();
  setPageSeo(tokenContent?.seo);
</script>

<style lang="scss" src="./style.scss"/>
