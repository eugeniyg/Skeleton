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

        <nuxt-img
          v-if="getContent(welcomeContent, defaultLocaleWelcomeContent, 'howGet.image')"
          class="img"
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
            v-for="(card, itemIndex) in welcomeContent?.welcome.items.length ? welcomeContent.welcome.items : defaultLocaleWelcomeContent?.welcome.items"
          >
            <div class="title">{{ card.title }}</div>
            <div class="sub-title">{{ card.topLabel }}</div>
            <nuxt-img class="img" :src="card.image" />

            <div class="actions">
              <button-base
                type="primary"
                size="md"
                @click="isLoggedIn ? openDepositModal() : showModal('register')"
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
            v-for="(card, itemIndex) in welcomeContent?.bonuses.items.length ? welcomeContent.bonuses.items : defaultLocaleWelcomeContent?.bonuses.items"
          >
            <div class="title">{{ card.subtitle }}</div>
            <div class="sub-title">{{ card.title }}</div>
            <nuxt-img class="img" :src="card.image" />

            <div class="actions">
              <button-base
                type="primary"
                size="md"
                @click="isLoggedIn ? openDepositModal() : showModal('register')"
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
  import { WelcomePageInterface } from '@skeleton/types';

  const {
    setPageSeo,
    findLocalesContentData,
    getContent,
  } = useProjectMethods();

  const globalStore = useGlobalStore();
  const { contentLocalesArray } = storeToRefs(globalStore);

  const welcomeContentRequest = await useAsyncData('welcomeContent', () => queryContent('welcome-bonuses')
    .where({ locale: { $in: contentLocalesArray.value } }).find());
  const { currentLocaleData, defaultLocaleData } = findLocalesContentData(welcomeContentRequest.data.value);
  const welcomeContent: Maybe<WelcomePageInterface> = currentLocaleData as WelcomePageInterface;
  const defaultLocaleWelcomeContent: Maybe<WelcomePageInterface> = defaultLocaleData as WelcomePageInterface;
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
  const { openDepositModal, showModal } = useLayoutStore();
  const { isLoggedIn } = storeToRefs(profileStore);
</script>

<style src="~/assets/styles/pages/welcome-package.scss" lang="scss" />
