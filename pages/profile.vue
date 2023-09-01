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
  import { IProfilePages, ISeoBlock } from '~/types';
  import {camelCase} from "lodash";

  definePageMeta({
    middleware: 'auth',
  });

  const { localizePath, getLocalesContentData } = useProjectMethods();
  const route = useRoute();

  const globalStore = useGlobalStore();
  const { currentLocale, defaultLocale } = storeToRefs(globalStore);

  const { getProfileFields } = useFieldsStore();
  const profileMenu = ref<{ id: string, title: string, url: string, seo: ISeoBlock }[]>([]);

  const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
    useAsyncData('currentLocaleProfilePages', () => queryContent(currentLocale.value?.code as string, 'profile').find()),
    currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
      : useAsyncData('defaultLocaleProfilePages', () => queryContent(defaultLocale.value?.code as string, 'profile').find()),
    useAsyncData('profileFields', getProfileFields),
  ]);

  const { currentLocaleData, defaultLocaleData } = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  let profileContent: Maybe<IProfilePages>;
  let defaultLocaleProfileContent: Maybe<IProfilePages>;

  if (currentLocaleData) {
    profileContent  = currentLocaleData.reduce((finalContentObj:any, currentContent:any) => {
      const splitPath = currentContent._path?.split('/');
      if (!splitPath) return finalContentObj;

      const collection = camelCase(splitPath[2]);
      const contentName = camelCase(splitPath[3]);
      return { ...finalContentObj, [collection]: { ...finalContentObj[collection], [contentName]: currentContent } }
    }, {})
  }

  if (defaultLocaleData) {
    defaultLocaleProfileContent  = defaultLocaleData.reduce((finalContentObj:any, currentContent:any) => {
      const splitPath = currentContent._path?.split('/');
      if (!splitPath) return finalContentObj;

      const collection = camelCase(splitPath[2]);
      const contentName = camelCase(splitPath[3]);
      return { ...finalContentObj, [collection]: { ...finalContentObj[collection], [contentName]: currentContent } }
    }, {})
  }

  const profileContentObj = profileContent || defaultLocaleProfileContent;
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

  const activePageSeo = computed(() => {
    const activePageData = profileMenu.value.find((item) => localizePath(item.url) === route.path);
    return activePageData?.seo;
  });
</script>

<style src="~/assets/styles/pages/profile.scss" lang="scss" />

