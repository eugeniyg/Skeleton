<template>
  <div class="home">
    <div v-if="homeContent?.banner" class="promo-card-wrapper">
      <card-home v-bind="homeContent.banner"/>
    </div>

    <div class="cards-wrap">
      <div class="cards-cat" v-if="homeContent?.categories">
        <card-category
          v-for="(item, itemIndex) in Object.keys(homeContent.categories)"
          :key="itemIndex"
          v-bind="homeContent.categories[item]"
        />
      </div>

      <group-benefits/>
    </div>

    <group-turbo/>

    <group-promotions/>

    <atomic-seo-text v-if="homeContent?.seo?.text" v-bind="homeContent.seo.text"/>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { HomeContentInterface } from '~/types';

  const globalStore = useGlobalStore();
  const { currentLocale } = storeToRefs(globalStore);

  const homeContentRequest = await useAsyncData(
    'homeContent',
    () => queryContent(`page-controls/${currentLocale.value?.code}`).only(['homePage']).findOne(),
  );
  const homeContent: HomeContentInterface | undefined = homeContentRequest.data.value?.homePage;
  const { setPageSeo } = useProjectMethods();
  setPageSeo(homeContent?.seo);
</script>
