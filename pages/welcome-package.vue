<template>
  <div>
    <div class="promotion">
      <h1 class="title">{{ getContent(welcomeContent, defaultLocaleWelcomeContent, 'title') }}</h1>
      <h4 class="sub-title">{{ getContent(welcomeContent, defaultLocaleWelcomeContent, 'description') }}</h4>

      <div v-if="getContent(welcomeContent, defaultLocaleWelcomeContent, 'howGet')" class="steps">
        <div class="title">{{ getContent(welcomeContent, defaultLocaleWelcomeContent, 'howGet.label') }}</div>

        <div class="items">
          <div
            class="item"
            :key="index"
            v-for="(item, index) in howGetItems"
          >
            <span class="number">{{ index + 1 }}</span>
            <p class="text">{{ item }}</p>
          </div>
        </div>

        <atomic-picture
          v-if="getContent(welcomeContent, defaultLocaleWelcomeContent, 'howGet.image')"
          :src="getContent(welcomeContent, defaultLocaleWelcomeContent, 'howGet.image')"
        />

      </div>

      <atomic-divider />

      <div class="welcome">
        <h4 class="title">{{ getContent(welcomeContent, defaultLocaleWelcomeContent, 'welcome.label') }}</h4>

        <div v-if="getContent(welcomeContent, defaultLocaleWelcomeContent, 'welcome.items')?.length" class="items">
          <div
            class="item"
            :key="itemIndex"
            v-for="(card, itemIndex) in getContent(welcomeContent, defaultLocaleWelcomeContent, 'welcome.items')"
          >
            <div class="title">{{ card.title }}</div>
            <div class="sub-title">{{ card.topLabel }}</div>

            <atomic-picture :src="card.image"/>

            <div class="actions">
              <button-base
                type="primary"
                size="md"
                @click="isLoggedIn ? openWalletModal('deposit') : showModal('register')"
              >
                {{ card.buttonLabel }}
              </button-base>

              <button-base
                type="ghost"
                size="md"
                :url="card.link.url"
              >
                {{ card.link.label }}
              </button-base>
            </div>

            <div class="arrow">
              <atomic-icon id="arrow_expand-close" />
            </div>
          </div>
        </div>
      </div>

      <atomic-divider />

      <div class="bonuses">
        <h4 class="title">{{ getContent(welcomeContent, defaultLocaleWelcomeContent, 'bonuses.label') }}</h4>

        <div v-if="getContent(welcomeContent, defaultLocaleWelcomeContent, 'bonuses.items')?.length" class="items">
          <div
            class="item"
            :key="itemIndex"
            v-for="(card, itemIndex) in getContent(welcomeContent, defaultLocaleWelcomeContent, 'bonuses.items')"
          >
            <div class="title">{{ card.subtitle }}</div>
            <div class="sub-title">{{ card.title }}</div>

            <atomic-picture :src="card.image" alt=""/>

            <div class="actions">
              <button-base
                type="primary"
                size="md"
                @click="isLoggedIn ? openWalletModal('deposit') : showModal('register')"
              >
                {{ card.buttonLabel }}
              </button-base>

              <button-base
                type="ghost"
                size="md"
                :url="card.link.url"
              >
                {{ card.link.label }}
              </button-base>
            </div>
          </div>
        </div>
      </div>
    </div>

    <atomic-seo-text v-if="welcomeContent?.seo?.text" v-bind="welcomeContent?.seo?.text" />
  </div>
</template>

<script setup lang='ts'>
  import { storeToRefs } from 'pinia';
  import type { IWelcomeBonusesPage } from '~/types';

  const {
    setPageSeo,
    getLocalesContentData,
    getContent
  } = useProjectMethods();

  const globalStore = useGlobalStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);

  let welcomeContent: Maybe<IWelcomeBonusesPage>;
  let defaultLocaleWelcomeContent: Maybe<IWelcomeBonusesPage>;
  const [nuxtCurrentLocaleData, nuxtDefaultLocaleData] = [
    useNuxtData('currentLocaleWelcomePageContent'),
    useNuxtData('defaultLocaleWelcomePageContent')
  ]

  if (nuxtCurrentLocaleData.data.value || nuxtDefaultLocaleData.data.value) {
    welcomeContent = nuxtCurrentLocaleData.data.value;
    defaultLocaleWelcomeContent = nuxtDefaultLocaleData.data.value;
  } else {
    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      useAsyncData('currentLocaleWelcomePageContent', () => queryContent(currentLocale.value?.code as string, 'pages', 'welcome-bonuses').findOne()),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : useAsyncData('defaultLocaleWelcomePageContent', () => queryContent(defaultLocale.value?.code as string, 'pages', 'welcome-bonuses').findOne())
    ]);

    const { currentLocaleData, defaultLocaleData } = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
    welcomeContent = currentLocaleData;
    defaultLocaleWelcomeContent = defaultLocaleData;
  }

  setPageSeo(welcomeContent?.seo);

  let howGetItems = [];
  if (getContent(welcomeContent, defaultLocaleWelcomeContent, 'howGet')) {
    howGetItems = [
      getContent(welcomeContent, defaultLocaleWelcomeContent, 'howGet.first'),
      getContent(welcomeContent, defaultLocaleWelcomeContent, 'howGet.second'),
      getContent(welcomeContent, defaultLocaleWelcomeContent, 'howGet.third'),
    ];
  }

  const profileStore = useProfileStore();
  const { openWalletModal, showModal } = useLayoutStore();
  const { isLoggedIn } = storeToRefs(profileStore);
</script>

<style src="~/assets/styles/pages/welcome-package.scss" lang="scss" />

