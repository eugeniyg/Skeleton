<template>
  <div class="bonus-page">
    <div class="header" :data-bg="getContent(currentLocaleBonusContent, defaultLocaleBonusContent, 'backgroundColor')">
      <atomic-picture
        v-if="getContent(currentLocaleBonusContent, defaultLocaleBonusContent, 'image')"
        class="img"
        :src="getContent(currentLocaleBonusContent, defaultLocaleBonusContent, 'image')"
        alt=""
      />
    </div>

    <div class="content">
      <h1 class="title">{{ getContent(currentLocaleBonusContent, defaultLocaleBonusContent, 'title') }}</h1>
      <h3 class="sub-title">{{ getContent(currentLocaleBonusContent, defaultLocaleBonusContent, 'subtitle') }}</h3>
      <atomic-text-editor
        class="description"
        :content="getContent(currentLocaleBonusContent, defaultLocaleBonusContent, 'description') || ''"
      />

      <button-base
        type="primary"
        size="lg"
        @click="clickButton(getContent(currentLocaleBonusContent, defaultLocaleBonusContent, 'button.url'))"
      >
        {{ getContent(currentLocaleBonusContent, defaultLocaleBonusContent, 'button.label') }}
      </button-base>

      <atomic-detail
        v-if="getContent(currentLocaleBonusContent, defaultLocaleBonusContent, 'termsLabel') && getContent(currentLocaleBonusContent, defaultLocaleBonusContent, 'termsContent')"
        :title="getContent(currentLocaleBonusContent, defaultLocaleBonusContent, 'termsLabel')"
        :content="getContent(currentLocaleBonusContent, defaultLocaleBonusContent, 'termsContent')"
      />
    </div>

    <atomic-seo-text v-if="currentLocaleBonusContent?.seo?.text" v-bind="currentLocaleBonusContent?.seo?.text" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IBonusPage } from "~/types";

  const route = useRoute();
  const { pageUrl } = route.params;
  const globalStore = useGlobalStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);

  const {
    localizePath,
    setPageSeo,
    getLocalesContentData,
    getContent
  } = useProjectMethods();

  const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
    useAsyncData(`${pageUrl}-current-content`, () => queryContent(currentLocale.value?.code as string, 'bonus', pageUrl as string).findOne()),
    currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
      : useAsyncData(`${pageUrl}-default-content`, () => queryContent(defaultLocale.value?.code as string, 'bonus', pageUrl as string).findOne())
  ]);

  const { currentLocaleData, defaultLocaleData } = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  const currentLocaleBonusContent: Maybe<IBonusPage> = currentLocaleData;
  const defaultLocaleBonusContent: Maybe<IBonusPage> = defaultLocaleData;
  setPageSeo(currentLocaleBonusContent?.seo);

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { openWalletModal, showModal } = useLayoutStore();

  const router = useRouter();
  const clickButton = (url: string|undefined):void => {
    if (url) router.push(localizePath(url));
    else isLoggedIn.value ? openWalletModal('deposit') : showModal('register');
  };
</script>

<style src="~/assets/styles/pages/bonus/index.scss" lang="scss" />

