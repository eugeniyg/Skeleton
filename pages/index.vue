<template>
  <div class="home">
    <div v-if="homeContent?.banner" class="promo-card-wrapper">
      <card-promo v-bind="homeContent.banner" />
    </div>

    <card-benefits v-if="benefitsContent" v-bind="benefitsContent" />

    <div v-if="homeContent?.categories" class="categories">
      <card-category
        v-for="(item, itemIndex) in Object.keys(homeContent.categories)"
        :key="itemIndex"
        v-bind="homeContent.categories[item]"
      />
    </div>

    <card-promotions v-if="promotionsContent" v-bind="promotionsContent" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { BenefitsContentInterface, HomeContentInterface, PromotionsContentInterface } from '~/types';

  const globalStore = useGlobalStore();
  const { currentLocale } = storeToRefs(globalStore);

  const homeContent = ref<HomeContentInterface|undefined>(undefined);
  const benefitsContent = ref<BenefitsContentInterface|undefined>(undefined);
  const promotionsContent = ref<PromotionsContentInterface|undefined>(undefined);
  const homeContentRequest = await useAsyncData(
    'homeContent',
    () => queryContent(`page-controls/${currentLocale.value.code}`).only(['homePage']).findOne(),
  );
  const globalComponentsContentRequest = await useAsyncData(
    'globalComponentsContent',
    () => queryContent(`global-components/${currentLocale.value.code}`).only(['benefits', 'promotions']).findOne(),
  );
  if (homeContentRequest.data.value) homeContent.value = homeContentRequest.data.value?.homePage as HomeContentInterface;
  if (globalComponentsContentRequest.data.value) {
    benefitsContent.value = globalComponentsContentRequest.data.value?.benefits as BenefitsContentInterface;
    promotionsContent.value = globalComponentsContentRequest.data.value?.promotions as PromotionsContentInterface;
  }
</script>
