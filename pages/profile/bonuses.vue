<template>
  <div class="content">
    <div class="header">
      <h1 class="heading">{{ bonusesContent?.title || defaultLocaleBonusesContent?.title }}</h1>
    </div>

    <atomic-empty variant="bonuses" sub-title="You have not received bonuses yet."/>
    <!--    <tab-bonuses :items="userProfileBonusesTabs"/>-->
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ProfileBonusesInterface } from '~/types';

  const globalStore = useGlobalStore();
  const { contentLocalesArray } = storeToRefs(globalStore);
  const { setPageSeo, findLocalesContentData } = useProjectMethods();
  const bonusesContentRequest = await useAsyncData('bonusesContent', () => queryContent('profile')
    .where({ locale: { $in: contentLocalesArray.value } }).only(['locale', 'bonuses']).find());
  const { currentLocaleData, defaultLocaleData } = findLocalesContentData(bonusesContentRequest.data.value);
  const bonusesContent: Maybe<ProfileBonusesInterface> = currentLocaleData?.bonuses;
  const defaultLocaleBonusesContent: Maybe<ProfileBonusesInterface> = defaultLocaleData?.bonuses;
  setPageSeo(bonusesContent?.seo);
</script>
