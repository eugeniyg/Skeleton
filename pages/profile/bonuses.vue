<template>
  <div class="content profile-bonuses">
    <div class="header">
      <h1 class="heading">
        {{ getContent(bonusesContent, defaultLocaleBonusesContent, 'title') }}
      </h1>
    </div>

    <nuxt-link
      class="link-bonus"
      :to="localizePath('/profile/history?tab=bonuses')"
    >
      {{ getContent(bonusesContent, defaultLocaleBonusesContent, 'historyLink') }}
    </nuxt-link>

    <bonuses-active v-if="activePlayerBonuses.length || activePlayerFreeSpins.length" />

    <bonuses-issued v-if="issuedPlayerBonuses.length || issuedPlayerFreeSpins.length || depositBonuses.length" />

    <!--    <bonus-code :content="content?.currentLocaleData?.bonusCode || content?.defaultLocaleData?.bonusCode" />-->

    <!--    <transition name="fade" mode="out-in">-->
    <!--      <bonus-active-->
    <!--        v-if="activePlayerBonuses.length"-->
    <!--        bonusType="bonus"-->
    <!--        :content="content?.currentLocaleData?.cashBonuses || content?.defaultLocaleData?.cashBonuses"-->
    <!--        @show-cancel-lock="showBonusCancelLockModal = true"-->
    <!--      />-->
    <!--    </transition>-->

    <!--    <transition name="fade" mode="out-in">-->
    <!--      <bonus-active-->
    <!--        v-if="activePlayerFreeSpins.length"-->
    <!--        bonusType="free-spin"-->
    <!--        :content="content?.currentLocaleData?.freeSpins || content?.defaultLocaleData?.freeSpins"-->
    <!--        @show-cancel-lock="showBonusCancelLockModal = true"-->
    <!--      />-->
    <!--    </transition>-->

    <modal-bonus-cancel-lock
      :showModal="showBonusCancelLockModal"
      @close="showBonusCancelLockModal = false"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IProfileBonuses } from '~/types';

  const globalStore = useGlobalStore();
  const bonusStore = useBonusStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);
  const { setPageMeta, getLocalesContentData, localizePath, getContent } = useProjectMethods();
  const { getPlayerBonuses, getPlayerFreeSpins, getDepositBonuses } = bonusStore;
  const {
    activePlayerBonuses,
    activePlayerFreeSpins,
    issuedPlayerBonuses,
    issuedPlayerFreeSpins,
    depositBonuses
  } = storeToRefs(bonusStore);

  const bonusesContent = ref<Maybe<IProfileBonuses>>();
  const defaultLocaleBonusesContent = ref<Maybe<IProfileBonuses>>();
  provide('bonusesContent', bonusesContent);
  provide('defaultLocaleBonusesContent', defaultLocaleBonusesContent);

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
    if (content.value) setContentData(content.value);
  }, { immediate: true });

  const showBonusCancelLockModal = ref(false);

  onMounted(() => {
    getPlayerBonuses();
    getPlayerFreeSpins();
    getDepositBonuses();
  })
</script>

<style src="~/assets/styles/pages/profile/bonuses.scss" lang="scss" />
