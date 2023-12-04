<template>
  <div>
    <div class="promotion">
      <h1 class="title">
        {{ getContent(welcomeContent, defaultLocaleWelcomeContent, 'title') }}
      </h1>

      <h4 class="sub-title">
        {{ getContent(welcomeContent, defaultLocaleWelcomeContent, 'description') }}
      </h4>

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
        <h4 class="title">
          {{ getContent(welcomeContent, defaultLocaleWelcomeContent, 'welcome.label') }}
        </h4>

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
        <h4 class="title">
          {{ getContent(welcomeContent, defaultLocaleWelcomeContent, 'bonuses.label') }}
        </h4>

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

  const welcomeContent = ref<Maybe<IWelcomeBonusesPage>>();
  const defaultLocaleWelcomeContent = ref<Maybe<IWelcomeBonusesPage>>();

  interface IPageContent {
    currentLocaleData: Maybe<IWelcomeBonusesPage>;
    defaultLocaleData: Maybe<IWelcomeBonusesPage>;
  }

  const setContentData = (contentData: Maybe<IPageContent>): void => {
    welcomeContent.value = contentData?.currentLocaleData;
    defaultLocaleWelcomeContent.value = contentData?.defaultLocaleData;
    setPageSeo(welcomeContent.value?.seo);
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const nuxtContentData = useNuxtData('welcomePageContent');
    if (nuxtContentData.data.value) return nuxtContentData.data.value;

    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'pages', 'welcome-bonuses').findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'pages', 'welcome-bonuses').findOne()
    ]);
    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  }

  const { pending, data } = await useLazyAsyncData('welcomePageContent', () => getPageContent());
  if (data.value) setContentData(data.value);

  watch(data, () => {
    setContentData(data.value);
  })

  const howGetItems = computed(() => {
    if (welcomeContent.value?.howGet || defaultLocaleWelcomeContent.value?.howGet) {
      return [
        getContent(welcomeContent.value, defaultLocaleWelcomeContent.value, 'howGet.first'),
        getContent(welcomeContent.value, defaultLocaleWelcomeContent.value, 'howGet.second'),
        getContent(welcomeContent.value, defaultLocaleWelcomeContent.value, 'howGet.third'),
      ];
    }
    return [];
  })

  const profileStore = useProfileStore();
  const { openWalletModal, showModal } = useLayoutStore();
  const { isLoggedIn } = storeToRefs(profileStore);
</script>

<style src="~/assets/styles/pages/welcome-package.scss" lang="scss" />

