<template>
  <div class="bonus-page">
    <div class="header" :data-bg="getContent(pageContent, defaultLocalePageContent, 'backgroundColor') || 'gray'">
      <nuxt-img
        v-if="getContent(pageContent, defaultLocalePageContent, 'image')"
        class="img"
        :src="getContent(pageContent, defaultLocalePageContent, 'image')"
        alt=""
      />
    </div>

    <div class="content">
      <h1 class="title">{{ getContent(pageContent, defaultLocalePageContent, 'title') }}</h1>
      <h3 class="sub-title">{{ getContent(pageContent, defaultLocalePageContent, 'subtitle') }}</h3>
      <atomic-text-editor
        class="description"
        :content="getContent(pageContent, defaultLocalePageContent, 'description') || ''"
      />

      <button-base
        type="primary"
        size="lg"
        @click="clickButton(getContent(pageContent, defaultLocalePageContent, 'button.url'))"
      >
        {{ getContent(pageContent, defaultLocalePageContent, 'button.label') }}
      </button-base>

      <atomic-detail
        v-if="getContent(pageContent, defaultLocalePageContent, 'termsLabel') && getContent(pageContent, defaultLocalePageContent, 'termsContent')"
        :title="getContent(pageContent, defaultLocalePageContent, 'termsLabel')"
        :content="getContent(pageContent, defaultLocalePageContent, 'termsContent')"
      />
    </div>

    <atomic-seo-text v-if="pageContent?.seo?.text" v-bind="pageContent?.seo?.text" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { BonusPageInterface } from '@skeleton/types';

  const pageContent = ref<BonusPageInterface|undefined>(undefined);
  const defaultLocalePageContent = ref<BonusPageInterface|undefined>(undefined);
  const route = useRoute();
  const { pageUrl } = route.params;
  const globalStore = useGlobalStore();
  const { contentLocalesArray } = storeToRefs(globalStore);

  const {
    localizePath,
    setPageSeo,
    findLocalesContentData,
    getContent,
  } = useProjectMethods();
  const contentRequest = await useAsyncData('bonusesPageContent', () => queryContent('bonus')
    .where({ locale: { $in: contentLocalesArray.value }, pageUrl }).find());

  if (contentRequest.error.value || !contentRequest.data.value?.length) {
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
  } else {
    const { currentLocaleData, defaultLocaleData } = findLocalesContentData(contentRequest.data.value);
    pageContent.value = currentLocaleData as BonusPageInterface;
    defaultLocalePageContent.value = defaultLocaleData as BonusPageInterface;
  }

  setPageSeo(pageContent.value?.seo);

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { openDepositModal, showModal } = useLayoutStore();

  const router = useRouter();
  const clickButton = (url: string|undefined):void => {
    if (url) router.push(localizePath(url));
    else isLoggedIn.value ? openDepositModal() : showModal('register');
  };
</script>

<style src="~/assets/styles/pages/bonus/index.scss" lang="scss" />
