<template>
  <div class="bonus-page">
    <div
      class="header"
      :data-bg="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'backgroundColor')"
    >
      <atomic-picture
        v-if="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'image')"
        class="img"
        :src="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'image')"
        alt=""
      />
    </div>

    <div v-show="pageContent?.currentLocaleData || pageContent?.defaultLocaleData" class="content">
      <h1 class="title">{{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'title') }}</h1>
      <h3 class="sub-title">
        {{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'subtitle') }}
      </h3>
      <atomic-text-editor
        class="description"
        :content="getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'description') || ''"
      />

      <button-base
        type="primary"
        size="lg"
        @click="clickButton(getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'button.url'))"
      >
        {{ getContent(pageContent?.currentLocaleData, pageContent?.defaultLocaleData, 'button.label') }}
      </button-base>

      <atomic-detail
        v-if="status === 'success' && detailLabel && detailContent"
        :title="detailLabel"
        :content="detailContent"
      />
    </div>

    <atomic-seo-text
      v-if="pageContent?.currentLocaleData?.pageMeta?.seoText"
      v-bind="pageContent.currentLocaleData.pageMeta.seoText"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IBonusPage } from '~/types';

  const route = useRoute();
  const { pageIdentity } = route.params;
  const { getContent } = useProjectMethods();

  const contentParams = {
    contentKey: `${pageIdentity}-bonus-content`,
    contentRoute: ['bonus'],
    where: { pageIdentity },
    isPage: true,
  };
  const { getContentData } = useContentLogic<IBonusPage>(contentParams);
  const { status, data: pageContent } = await useLazyAsyncData(getContentData);

  const detailLabel = computed(() =>
    getContent(pageContent.value?.currentLocaleData, pageContent.value?.defaultLocaleData, 'termsLabel')
  );
  const detailContent = computed(() =>
    getContent(pageContent.value?.currentLocaleData, pageContent.value?.defaultLocaleData, 'termsContent')
  );

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { openModal, openWalletModal } = useModalStore();

  const clickButton = (url: string | undefined): void => {
    const { handleExternalLink } = useProjectMethods();
    if (url) handleExternalLink(url);
    else if (isLoggedIn.value) openWalletModal('deposit');
    else openModal('sign-up');
  };
</script>

<style src="~/assets/styles/pages/bonus/index.scss" lang="scss" />
