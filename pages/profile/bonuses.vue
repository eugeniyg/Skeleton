<template>
  <div class="content profile-bonuses">
    <div class="header">
      <h1 class="heading">{{ bonusesContent?.title || defaultLocaleBonusesContent?.title }}</h1>
    </div>

    <nuxt-link
      class="link-bonus"
      :to="localizePath('/profile/history?tab=bonuses')"
    >
      {{ bonusesContent?.historyLink || defaultLocaleBonusesContent?.historyLink }}
    </nuxt-link>

    <bonus-code :content="bonusesContent?.bonusCode || defaultLocaleBonusesContent?.bonusCode" />
    <bonus-active :content="bonusesContent?.cashBonuses || defaultLocaleBonusesContent?.cashBonuses" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ProfileBonusesInterface } from '@skeleton/types';

  const globalStore = useGlobalStore();
  const { contentLocalesArray } = storeToRefs(globalStore);
  const { setPageSeo, findLocalesContentData, localizePath } = useProjectMethods();
  const { getPlayerBonuses } = useBonusStore();

  const [bonusesContentRequest] = await Promise.all([
    useAsyncData('bonusesContent', () => queryContent('profile')
      .where({ locale: { $in: contentLocalesArray.value } }).only(['locale', 'bonuses']).find()),
    useAsyncData('updatePlayerBonuses', getPlayerBonuses),
  ]);

  const { currentLocaleData, defaultLocaleData } = findLocalesContentData(bonusesContentRequest.data.value);
  const bonusesContent: Maybe<ProfileBonusesInterface> = currentLocaleData?.bonuses;
  const defaultLocaleBonusesContent: Maybe<ProfileBonusesInterface> = defaultLocaleData?.bonuses;
  setPageSeo(bonusesContent?.seo);
</script>

<style src="~/assets/styles/pages/profile/bonuses.scss" lang="scss" />
