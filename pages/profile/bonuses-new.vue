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
    
    
    <div class="profile-bonuses-new__grid">
      <bonuses-type-title title="Active bonuses"/>
      
      <bonuses-bonus-package status="active"/>
      
      <bonuses-bonus type="cash" status="active"/>
      
      <bonuses-bonus type="percent" status="active"/>
      
      <atomic-divider/>
      <bonuses-type-title title="Available bonuses" count="17"/>
      
      <bonuses-bonus
        type="cash"
        status="available"
      />
      
      <bonuses-bonus
        type="fs"
        status="available"
      />
      
      <bonuses-bonus
        type="percent"
        status="future"
      />
    </div>
    
    <atomic-divider/>
    <bonuses-promo-code :content="bonuses.promoCode"/>
    
    <modal-bonus-info/>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IProfileBonuses } from '~/types';
  
  const { bonuses } = useFakeStore();
  
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
