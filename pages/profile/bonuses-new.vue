<template>
  <div class="content profile-bonuses-new">
    <div class="header">
      <h1 class="heading">
        {{ content?.currentLocaleData?.title || content?.defaultLocaleData?.title }}
      </h1>
    </div>
    
    <nuxt-link
      class="link-bonus"
      :to="localizePath('/profile/history?tab=bonuses')"
    >
      {{ content?.currentLocaleData?.historyLink || content?.defaultLocaleData?.historyLink }}
    </nuxt-link>
    
    
    <bonuses-bonus-package is-active/>
<!--    <bonuses-bonus-package/>-->
    <bonuses-bonus-cash is-active/>
    <bonuses-bonus-percent is-active/>
<!--    <bonuses-bonus-cashback is-active/>-->
<!--    <bonuses-bonus-fs is-active/>-->
    
    <bonus-code :content="content?.currentLocaleData?.bonusCode || content?.defaultLocaleData?.bonusCode" />
    
    <transition name="fade" mode="out-in">
      <bonus-active
        v-if="activePlayerBonuses.length"
        bonusType="bonus"
        :content="content?.currentLocaleData?.cashBonuses || content?.defaultLocaleData?.cashBonuses"
      />
    </transition>
    
    <transition name="fade" mode="out-in">
      <bonus-active
        v-if="activePlayerFreeSpins.length"
        bonusType="free-spin"
        :content="content?.currentLocaleData?.freeSpins || content?.defaultLocaleData?.freeSpins"
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
  
  interface IPageContent {
    currentLocaleData: Maybe<IProfileBonuses>;
    defaultLocaleData: Maybe<IProfileBonuses>;
  }
  
  const getPageContent = async (): Promise<IPageContent> => {
    const { data } = useNuxtData('profileBonusesContent');
    if (data.value) return data.value;
    
    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'profile', 'bonuses').findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'profile', 'bonuses').findOne()
    ]);
    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  }
  
  const { data: content } = await useLazyAsyncData('profileBonusesContent', () => getPageContent());
  
  watch(content, () => {
    if (content.value) setPageMeta(content.value?.currentLocaleData?.pageMeta);
  }, { immediate: true });
  
  onMounted(() => {
    getPlayerBonuses();
    getPlayerFreeSpins();
  })
</script>

<style src="~/assets/styles/pages/profile/bonuses-new.scss" lang="scss" />
