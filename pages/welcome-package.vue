<template>
  <div>
    <div class="promotion">
      <h1 class="title">
        {{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'title') }}
      </h1>

      <h4 class="sub-title">
        {{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'description') }}
      </h4>

      <div v-if="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'howGet')" class="steps">
        <div class="title">{{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'howGet.label') }}</div>

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
          v-if="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'howGet.image')"
          :src="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'howGet.image')"
        />
      </div>

      <atomic-divider />

      <div class="welcome">
        <h4 class="title">
          {{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'welcome.label') }}
        </h4>

        <div v-if="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'welcome.items')?.length" class="items">
          <div
            v-for="(card, itemIndex) in getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'welcome.items')"
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
          {{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'bonuses.label') }}
        </h4>

        <div v-if="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'bonuses.items')?.length" class="items">
          <div
            v-for="(card, itemIndex) in getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'bonuses.items')"
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

    <atomic-seo-text v-if="pageContent?.currentLocaleData?.pageMeta?.seoText" v-bind="pageContent.currentLocaleData.pageMeta.seoText" />
  </div>
</template>

<script setup lang='ts'>
  import { storeToRefs } from 'pinia';
  import type {IWelcomeBonusesPage} from '~/types';

  const { getContent } = useProjectMethods();

  const contentParams = {
    contentKey: 'welcomePageContent',
    contentRoute: ['pages', 'welcome-bonuses'],
    isPage: true
  };
  const { getContentData } = useContentLogic<IWelcomeBonusesPage>(contentParams);
  const { data: pageContent } = await useLazyAsyncData(contentParams.contentKey, () => getContentData());

  const howGetItems = computed(() => {
    if (pageContent.value?.currentLocaleData?.howGet || pageContent.value?.defaultLocaleData?.howGet) {
      return [
        getContent(pageContent.value?.currentLocaleData, pageContent.value?.defaultLocaleData, 'howGet.first'),
        getContent(pageContent.value?.currentLocaleData, pageContent.value?.defaultLocaleData, 'howGet.second'),
        getContent(pageContent.value?.currentLocaleData, pageContent.value?.defaultLocaleData, 'howGet.third'),
      ];
    }
    return [];
  })

  const profileStore = useProfileStore();
  const { openWalletModal, showModal } = useLayoutStore();
  const { isLoggedIn } = storeToRefs(profileStore);
</script>

<style src="~/assets/styles/pages/welcome-package.scss" lang="scss" />

