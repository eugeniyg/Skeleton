<template>
  <div class="content">
    <div class="header">
      <h1 class="heading">{{ bonusesContent?.title }}</h1>
    </div>

    <tab-bonuses :items="userProfileBonusesTabs"/>
  </div>
</template>

<script setup lang="ts">
  import { ProfileBonusesInterface } from '~/types';

  const { userProfileBonusesTabs } = useFakeStore();

  const globalStore = useGlobalStore();
  const bonusesContentRequest = await useAsyncData('bonusesContent', () => queryContent(`profile/${globalStore.currentLocale?.code}`).only(['bonuses']).findOne());
  const bonusesContent:ProfileBonusesInterface|undefined = bonusesContentRequest.data.value?.bonuses;
  const { setPageSeo } = useProjectMethods();
  setPageSeo(bonusesContent?.seo);
</script>
