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

    <transition name="fade" mode="out-in">
      <bonus-active
        v-if="activePlayerBonuses.length"
        bonusType="bonus"
        :content="bonusesContent?.cashBonuses || defaultLocaleBonusesContent?.cashBonuses"
      />
    </transition>

    <transition name="fade" mode="out-in">
      <bonus-active
        v-if="activePlayerFreeSpins.length"
        bonusType="free-spin"
        :content="bonusesContent?.freeSpins || defaultLocaleBonusesContent?.freeSpins"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IProfileBonuses } from '~/types';

  const globalStore = useGlobalStore();
  const bonusStore = useBonusStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);
  const { setPageSeo, getLocalesContentData, localizePath } = useProjectMethods();
  const { getPlayerBonuses, getPlayerFreeSpins } = bonusStore;
  const { activePlayerBonuses, activePlayerFreeSpins } = storeToRefs(bonusStore);

  let bonusesContent: Maybe<IProfileBonuses>;
  let defaultLocaleBonusesContent: Maybe<IProfileBonuses>;
  const [nuxtCurrentLocaleData, nuxtDefaultLocaleData] = [
    useNuxtData('currentLocaleProfileBonusesContent'),
    useNuxtData('defaultLocaleProfileBonusesContent')
  ]

  if (nuxtCurrentLocaleData.data.value || nuxtDefaultLocaleData.data.value) {
    bonusesContent = nuxtCurrentLocaleData.data.value;
    defaultLocaleBonusesContent = nuxtDefaultLocaleData.data.value;
  } else {
    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      useAsyncData('currentLocaleProfileBonusesContent', () => queryContent(currentLocale.value?.code as string, 'profile', 'bonuses').findOne()),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : useAsyncData('defaultLocaleProfileBonusesContent', () => queryContent(defaultLocale.value?.code as string, 'profile', 'bonuses').findOne())
    ]);

    const { currentLocaleData, defaultLocaleData } = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
    bonusesContent = currentLocaleData;
    defaultLocaleBonusesContent = defaultLocaleData;
  }

  setPageSeo(bonusesContent?.seo);

  onMounted(() => {
    getPlayerBonuses();
    getPlayerFreeSpins();
  })
</script>

<style src="~/assets/styles/pages/profile/bonuses.scss" lang="scss" />
