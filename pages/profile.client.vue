<template>
  <div class="user-profile">
    <nav-profile v-if="profileMenu.length" :items="profileMenu" />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
  import type { IProfilePages } from '~/types';
  import camelCase from 'lodash/camelCase';

  const { getProfileFields } = useFieldsStore();
  const contentParams = {
    contentCollection: 'profile',
    findAll: true,
  };
  const { getContentData } = useContentLogic<IProfilePages>(contentParams);
  const { data: pageContent } = await useLazyAsyncData('profilePages', getContentData);

  const profileContent = computed<IProfilePages | undefined>(() => {
    if (!pageContent.value?.currentLocaleData?.length) return undefined;

    return pageContent.value?.currentLocaleData.reduce((finalContentObj: any, currentContent: any) => {
      const splitPath = currentContent.stem?.split('/');
      if (!splitPath) return finalContentObj;

      const contentName = camelCase(splitPath[2]);
      return { ...finalContentObj, [contentName]: currentContent };
    }, {});
  });

  const defaultLocaleProfileContent = computed<IProfilePages | undefined>(() => {
    if (!pageContent.value?.defaultLocaleData?.length) return undefined;

    return pageContent.value?.defaultLocaleData.reduce((finalContentObj: any, currentContent: any) => {
      const splitPath = currentContent.stem?.split('/');
      if (!splitPath) return finalContentObj;

      const contentName = camelCase(splitPath[2]);
      return { ...finalContentObj, [contentName]: currentContent };
    }, {});
  });

  const router = useRouter();
  const { routes } = router.options;
  const profilePages = routes.find(route => route.name === 'profile');

  const profileMenu = computed<{ id: string; title: string; url: string }[]>(() => {
    if (!profilePages?.children?.length) return [];

    return profilePages.children.map(page => {
      const pageId = page.path;
      return {
        id: pageId,
        title:
          profileContent.value?.[pageId]?.title ||
          defaultLocaleProfileContent.value?.[pageId]?.title ||
          pageId[0].toUpperCase() + pageId.slice(1),
        url: `/profile/${pageId}`,
      };
    });
  });

  onBeforeMount(() => {
    getProfileFields();
  });
</script>

<style src="~/assets/styles/pages/profile.scss" lang="scss" />
