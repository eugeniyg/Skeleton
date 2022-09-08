<template>
  <div class="home">
    <div v-if="homeContent?.banner" class="promo-card-wrapper">
      <card-promo v-bind="homeContent.banner" />
    </div>

    <card-benefits />

    <div v-if="homeContent?.categories" class="categories">
      <card-category
        v-for="(item, itemIndex) in Object.keys(homeContent.categories)"
        :key="itemIndex"
        v-bind="homeContent.categories[item]"
      />
    </div>

    <card-promotions />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { HomeContentInterface } from '~/types';

  const globalStore = useGlobalStore();
  const { currentLocale } = storeToRefs(globalStore);

  const homeContentRequest = await useAsyncData(
    'homeContent',
    () => queryContent(`page-controls/${currentLocale.value.code}`).only(['homePage']).findOne(),
  );
  const homeContent:HomeContentInterface|undefined = homeContentRequest.data.value?.homePage;
</script>
