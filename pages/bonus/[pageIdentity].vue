<template>
  <div class="bonus-page">
    <div class="header" :data-bg="getContent(currentLocaleContent, defaultLocaleContent, 'backgroundColor')">
      <atomic-picture
        v-if="getContent(currentLocaleContent, defaultLocaleContent, 'image')"
        class="img"
        :src="getContent(currentLocaleContent, defaultLocaleContent, 'image')"
        alt=""
      />
    </div>

    <div v-show="currentLocaleContent || defaultLocaleContent" class="content">
      <h1 class="title">{{ getContent(currentLocaleContent, defaultLocaleContent, 'title') }}</h1>
      <h3 class="sub-title">{{ getContent(currentLocaleContent, defaultLocaleContent, 'subtitle') }}</h3>
      <atomic-text-editor
        class="description"
        :content="getContent(currentLocaleContent, defaultLocaleContent, 'description') || ''"
      />

      <button-base
        type="primary"
        size="lg"
        @click="clickButton(getContent(currentLocaleContent, defaultLocaleContent, 'button.url'))"
      >
        {{ getContent(currentLocaleContent, defaultLocaleContent, 'button.label') }}
      </button-base>

      <atomic-detail
        v-if="status === 'success' && detailLabel && detailContent"
        :title="detailLabel"
        :content="detailContent"
      />
    </div>

    <atomic-seo-text v-if="currentLocaleContent?.pageMeta?.seoText" v-bind="currentLocaleContent?.pageMeta?.seoText" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IBonusPage } from "~/types";

  const route = useRoute();
  const { pageIdentity } = route.params;
  const { getContent } = useProjectMethods();

  const { currentLocaleContent, defaultLocaleContent, status } = await useContentLogic<IBonusPage>({
    contentKey: `${pageIdentity}-bonus-content`,
    contentRoute: ['bonus'],
    where: { pageIdentity },
    isPage: true
  });

  const detailLabel = computed(() => getContent(currentLocaleContent.value, defaultLocaleContent.value, 'termsLabel'));
  const detailContent = computed(() => getContent(currentLocaleContent.value, defaultLocaleContent.value, 'termsContent'));

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { openWalletModal, showModal } = useLayoutStore();
  
  const clickButton = (url: string|undefined):void => {
    const { handleExternalLink } = useProjectMethods();
    if (url) handleExternalLink(url)
    else isLoggedIn.value ? openWalletModal('deposit') : showModal('register');
  };
</script>

<style src="~/assets/styles/pages/bonus/index.scss" lang="scss" />

