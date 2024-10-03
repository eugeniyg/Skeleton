<template>
  <div>
    <div class="promotion">
      <h1 class="title">
        {{ getContent(currentLocaleContent, defaultLocaleContent, 'title') }}
      </h1>

      <h4 class="sub-title">
        {{ getContent(currentLocaleContent, defaultLocaleContent, 'description') }}
      </h4>

      <div v-if="getContent(currentLocaleContent, defaultLocaleContent, 'howGet')" class="steps">
        <div class="title">{{ getContent(currentLocaleContent, defaultLocaleContent, 'howGet.label') }}</div>

        <div class="items">
          <div
            v-for="(item, index) in howGetItems"
            :key="index"
            class="item"
          >
            <span class="number">{{ index + 1 }}</span>
            <p class="text">{{ item }}</p>
          </div>
        </div>

        <atomic-picture
          v-if="getContent(currentLocaleContent, defaultLocaleContent, 'howGet.image')"
          :src="getContent(currentLocaleContent, defaultLocaleContent, 'howGet.image')"
        />
      </div>

      <atomic-divider />

      <div class="welcome">
        <h4 class="title">
          {{ getContent(currentLocaleContent, defaultLocaleContent, 'welcome.label') }}
        </h4>

        <div v-if="getContent(currentLocaleContent, defaultLocaleContent, 'welcome.items')?.length" class="items">
          <div
            v-for="(card, itemIndex) in getContent(currentLocaleContent, defaultLocaleContent, 'welcome.items')"
            :key="itemIndex"
            class="item"
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
                :targetBlank="card.link.targetBlank"
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
          {{ getContent(currentLocaleContent, defaultLocaleContent, 'bonuses.label') }}
        </h4>

        <div v-if="getContent(currentLocaleContent, defaultLocaleContent, 'bonuses.items')?.length" class="items">
          <div
            v-for="(card, itemIndex) in getContent(currentLocaleContent, defaultLocaleContent, 'bonuses.items')"
            :key="itemIndex"
            class="item"
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
                :targetBlank="card.link.targetBlank"
              >
                {{ card.link.label }}
              </button-base>
            </div>
          </div>
        </div>
      </div>
    </div>

    <atomic-seo-text v-if="currentLocaleContent?.pageMeta?.seoText" v-bind="currentLocaleContent?.pageMeta?.seoText" />
  </div>
</template>

<script setup lang='ts'>
  import { storeToRefs } from 'pinia';
  import type { IWelcomeBonusesPage } from '~/types';

  const { getContent } = useProjectMethods();

  const { currentLocaleContent, defaultLocaleContent } = await useContentLogic<IWelcomeBonusesPage>({
    contentKey: 'welcomePageContent',
    contentRoute: ['pages', 'welcome-bonuses'],
    isPage: true
  });

  const howGetItems = computed(() => {
    if (currentLocaleContent.value?.howGet || defaultLocaleContent.value?.howGet) {
      return [
        getContent(currentLocaleContent.value, defaultLocaleContent.value, 'howGet.first'),
        getContent(currentLocaleContent.value, defaultLocaleContent.value, 'howGet.second'),
        getContent(currentLocaleContent.value, defaultLocaleContent.value, 'howGet.third'),
      ];
    }
    return [];
  })

  const profileStore = useProfileStore();
  const { openWalletModal, showModal } = useLayoutStore();
  const { isLoggedIn } = storeToRefs(profileStore);
</script>

<style src="~/assets/styles/pages/welcome-package.scss" lang="scss" />

