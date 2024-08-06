<template>
  <div class="verification content">
    <div class="header">
      <h1 class="heading">
        {{ verificationContent?.title || defaultLocaleVerificationContent?.title }}
      </h1>
    </div>

    <div v-if="hasEmailField" class="verification__profile">
      <verification-email />
    </div>

    <verification-sumsub v-if="sumsubIntegrated" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type {IProfileVerification} from '~/types';

  const { setPageMeta, getLocalesContentData } = useProjectMethods();
  const globalStore = useGlobalStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);
  const fieldsStore = useFieldsStore();
  const { profileFields } = storeToRefs(fieldsStore);
  const hasEmailField = computed(() => {
    return !!profileFields.value.find(field => field.name === 'email');
  })

  const verificationContent = ref<Maybe<IProfileVerification>>();
  const defaultLocaleVerificationContent = ref<Maybe<IProfileVerification>>();
  provide('verificationContent', verificationContent);
  provide('defaultLocaleVerificationContent', defaultLocaleVerificationContent);

  interface IPageContent {
    currentLocaleData: Maybe<IProfileVerification>;
    defaultLocaleData: Maybe<IProfileVerification>;
  }

  const setContentData = (contentData: Maybe<IPageContent>): void => {
    verificationContent.value = contentData?.currentLocaleData;
    defaultLocaleVerificationContent.value = contentData?.defaultLocaleData;
    setPageMeta(verificationContent.value?.pageMeta);
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const { data } = useNuxtData('profileVerificationContent');
    if (data.value) return data.value;

    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'profile', 'verification').findOne(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
      : queryContent(defaultLocale.value?.code as string, 'profile', 'verification').findOne()
    ]);
    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  }

  const { data: content } = await useLazyAsyncData('profileVerificationContent', () => getPageContent());

  watch(content, () => {
    if (content.value) setContentData(content.value);
  }, { immediate: true });

  const runtimeConfig = useRuntimeConfig();
  const sumsubIntegrated = !!runtimeConfig.public.sumsub?.appToken;
</script>
