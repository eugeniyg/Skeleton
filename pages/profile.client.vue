<template>
  <div class="user-profile">
    <nav-profile v-if="profileMenu.length" :items="profileMenu"/>

    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IProfilePages } from '~/types';
  import camelCase from "lodash/camelCase";

  const { getLocalesContentData } = useProjectMethods();

  const globalStore = useGlobalStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);

  const { getProfileFields } = useFieldsStore();
  const profileMenu = ref<{ id: string, title: string, url: string }[]>([]);

  const currentLocaleData = ref<Maybe<IProfilePages>>();
  const defaultLocaleData = ref<Maybe<IProfilePages>>();
  const profileContent = ref<Maybe<IProfilePages>>();
  const defaultLocaleProfileContent = ref<Maybe<IProfilePages>>();

  interface IPageContent {
    currentLocaleData: Maybe<IProfilePages>;
    defaultLocaleData: Maybe<IProfilePages>;
  }

  const setPageContent = ():void => {
    if (currentLocaleData.value?.length) {
      profileContent.value  = currentLocaleData.value.reduce((finalContentObj:any, currentContent:any) => {
        const splitPath = currentContent._path?.split('/');
        if (!splitPath) return finalContentObj;

        const contentName = camelCase(splitPath[3]);
        return { ...finalContentObj, [contentName]: currentContent }
      }, {})
    }

    if (defaultLocaleData.value?.length) {
      defaultLocaleProfileContent.value  = defaultLocaleData.value.reduce((finalContentObj:any, currentContent:any) => {
        const splitPath = currentContent._path?.split('/');
        if (!splitPath) return finalContentObj;

        const contentName = camelCase(splitPath[3]);
        return { ...finalContentObj, [contentName]: currentContent }
      }, {})
    }

    const profileContentObj = profileContent.value || defaultLocaleProfileContent.value;
    if (profileContentObj) {
      const runtimeConfig = useRuntimeConfig();
      const hasSumsubIntegration = !!runtimeConfig.public.sumsub?.appToken;
      const filteredArray = Object.keys(profileContentObj).filter((key) => {
        if (key === 'verification' && !hasSumsubIntegration) return false;
        if (profileContentObj[key]?.title) return key;
        return false;
      })

      profileMenu.value = filteredArray.map((key) => ({
        id: key,
        title: profileContentObj[key].title,
        url: `/profile/${key}`
      }));
    }
  }

  const setContentData = (contentData: Maybe<IPageContent>): void => {
    currentLocaleData.value = contentData?.currentLocaleData;
    defaultLocaleData.value = contentData?.defaultLocaleData;
    setPageContent();
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const nuxtContentData = useNuxtData('profilePages');
    if (nuxtContentData.data.value) return nuxtContentData.data.value;

    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale.value?.code as string, 'profile').find(),
      currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
        : queryContent(defaultLocale.value?.code as string, 'profile').find()
    ]);
    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  }

  const { data: content } = await useLazyAsyncData('profilePages', () => getPageContent());

  watch(content, () => {
    if (content.value) setContentData(content.value);
  }, { immediate: true });

  onBeforeMount(() => {
    getProfileFields();
  })
</script>

<style src="~/assets/styles/pages/profile.scss" lang="scss" />

