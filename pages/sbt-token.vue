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
  import { TokenContentInterface } from '~/types';

  const globalStore = useGlobalStore();
  const { contentLocalesArray } = storeToRefs(globalStore);
  const { setPageSeo, findLocalesContentData } = useProjectMethods();
  const tokenContentRequest = await useAsyncData('tokenContent', () => queryContent('page-controls')
    .where({ locale: { $in: contentLocalesArray.value } }).only(['locale', 'tokenPage']).find());
  const { currentLocaleData } = findLocalesContentData(tokenContentRequest.data.value);
  const tokenContent: Maybe<TokenContentInterface> = currentLocaleData?.tokenPage;
  setPageSeo(tokenContent?.seo);
</script>

<style lang="scss">
.sbt-token {
  display: grid;
  grid-template-areas:
    "container"
    "seo";
  align-items: var(--align-items, flex-end);
  grid-template-columns: 1fr auto;
  width: 100%;
  height: 100%;

  .container {
    background-color: var(--black-primary);
    grid-area: container;
    position: relative;
    width: 100%;
    height: calc(100vh - 56px);
    transform: translateY(#{rem(-16px)});
    @media (orientation: landscape) {
      height: 100vh;
    }

    @include media(md) {
      height: 100vh;
    }

    iframe {
      display: block;
      border: none !important;

      @include media(l) {
        position: relative;
      }
    }
  }

  .text-wrap {
    grid-area: seo;
  }
}
</style>
