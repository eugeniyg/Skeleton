<template>
  <div>
    <div class="user-profile">
      <nav-profile v-if="profileMenu.length" :items="profileMenu"/>

      <NuxtPage />
    </div>

    <atomic-seo-text v-if="activePageSeo?.text" v-bind="activePageSeo?.text" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IProfilePages, ISeoBlock } from '~/types';
  import camelCase from "lodash/camelCase";

  definePageMeta({
    middleware: 'auth',
  });

  const { localizePath, getLocalesContentData } = useProjectMethods();
  const route = useRoute();

  const globalStore = useGlobalStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);

  const { getProfileFields } = useFieldsStore();
  const profileMenu = ref<{ id: string, title: string, url: string, seo: ISeoBlock }[]>([]);

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
      const filteredArray = Object.keys(profileContentObj).filter((key) => {
        if (profileContentObj[key]?.title) return key;
        return false;
      })

      profileMenu.value = filteredArray.map((key) => ({
        id: key,
        title: profileContentObj[key].title,
        url: `/profile/${key}`,
        seo: profileContentObj[key].seo,
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

  const { pending, data } = await useLazyAsyncData('profilePages', () => getPageContent());
  if (data.value) setContentData(data.value);

  watch(data, () => {
    setContentData(data.value);
  })

  const activePageSeo = computed(() => {
    const activePageData = profileMenu.value.find((item) => localizePath(item.url) === route.path);
    return activePageData?.seo;
  });

  onBeforeMount(() => {
    getProfileFields();
  })
</script>

<style src="~/assets/styles/pages/profile.scss" lang="scss" />

