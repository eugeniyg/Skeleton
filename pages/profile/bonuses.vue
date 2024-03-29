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
  const { setPageMeta, getLocalesContentData, localizePath } = useProjectMethods();
  const { getPlayerBonuses, getPlayerFreeSpins } = bonusStore;
  const { activePlayerBonuses, activePlayerFreeSpins } = storeToRefs(bonusStore);

  const bonusesContent = ref<Maybe<IProfileBonuses>>();
  const defaultLocaleBonusesContent = ref<Maybe<IProfileBonuses>>();

  interface IPageContent {
    currentLocaleData: Maybe<IProfileBonuses>;
    defaultLocaleData: Maybe<IProfileBonuses>;
  }

  const setContentData = (contentData: Maybe<IPageContent>): void => {
    bonusesContent.value = contentData?.currentLocaleData;
    defaultLocaleBonusesContent.value = contentData?.defaultLocaleData;
    setPageMeta(bonusesContent.value?.pageMeta);
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const nuxtContentData = useNuxtData('profileBonusesContent');
    if (nuxtContentData.data.value) return nuxtContentData.data.value;

    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'profile', 'bonuses').findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'profile', 'bonuses').findOne()
    ]);
    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  }

  const { pending, data } = await useLazyAsyncData('profileBonusesContent', () => getPageContent());
  if (data.value) setContentData(data.value);

  watch(data, () => {
    setContentData(data.value);
  })

  onMounted(() => {
    getPlayerBonuses();
    getPlayerFreeSpins();
  })
</script>

<style src="~/assets/styles/pages/profile/bonuses.scss" lang="scss" />
