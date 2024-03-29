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

    <div class="content" v-show="currentLocaleBonusContent || defaultLocaleBonusContent">
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
        v-if="!pending && detailLabel && detailContent"
        :title="detailLabel"
        :content="detailContent"
      />
    </div>

    <atomic-seo-text v-if="currentLocaleBonusContent?.pageMeta?.seoText" v-bind="currentLocaleBonusContent?.pageMeta?.seoText" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IBonusPage } from "~/types";

  const route = useRoute();
  const { pageIdentity } = route.params;
  const globalStore = useGlobalStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);

  const {
    localizePath,
    setPageMeta,
    getLocalesContentData,
    getContent
  } = useProjectMethods();

  interface IPageContent {
    currentLocaleData: Maybe<IBonusPage>;
    defaultLocaleData: Maybe<IBonusPage>;
  }

  const currentLocaleBonusContent = ref<Maybe<IBonusPage>>();
  const defaultLocaleBonusContent = ref<Maybe<IBonusPage>>();

  const setContentData = (contentData: Maybe<IPageContent>): void => {
    currentLocaleBonusContent.value = contentData?.currentLocaleData;
    defaultLocaleBonusContent.value = contentData?.defaultLocaleData;
    setPageMeta(currentLocaleBonusContent.value?.pageMeta);
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const nuxtContentData = useNuxtData(`${pageIdentity}-bonus-content`);
    if (nuxtContentData.data.value) return nuxtContentData.data.value;

    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'bonus').where({ pageIdentity }).findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'bonus').where({ pageIdentity }).findOne()
    ]);
    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  }

  const { pending, data } = await useLazyAsyncData(`${pageIdentity}-bonus-content`, () => getPageContent());
  if (data.value) setContentData(data.value);

  watch(data, () => {
    setContentData(data.value);
  })

  const detailLabel = computed(() => getContent(currentLocaleBonusContent.value, defaultLocaleBonusContent.value, 'termsLabel'));
  const detailContent = computed(() => getContent(currentLocaleBonusContent.value, defaultLocaleBonusContent.value, 'termsContent'));

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

