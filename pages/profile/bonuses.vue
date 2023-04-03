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
  import { ProfileBonusesInterface } from '~/types';

  const globalStore = useGlobalStore();
  const { contentLocalesArray } = storeToRefs(globalStore);
  const { setPageSeo, findLocalesContentData, localizePath } = useProjectMethods();
  const bonusesContentRequest = await useAsyncData('bonusesContent', () => queryContent('profile')
    .where({ locale: { $in: contentLocalesArray.value } }).only(['locale', 'bonuses']).find());
  const { currentLocaleData, defaultLocaleData } = findLocalesContentData(bonusesContentRequest.data.value);
  const bonusesContent: Maybe<ProfileBonusesInterface> = currentLocaleData?.bonuses;
  const defaultLocaleBonusesContent: Maybe<ProfileBonusesInterface> = defaultLocaleData?.bonuses;
  setPageSeo(bonusesContent?.seo);
</script>

<style lang="scss">
.profile-bonuses {
  .link-bonus {
    @include font($body-2);
    color: var(--yellow-500);
    text-decoration: none;
    display: flex;
    width: fit-content;
    margin-top: -16px;
    grid-column-gap: rem(4px);
    align-items: center;
    min-height: rem(22px);

    .icon {
      color: var(--yellow-500);
    }
  }
}
</style>
