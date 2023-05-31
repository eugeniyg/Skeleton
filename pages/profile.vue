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
  import { ProfileContentInterface, SeoContentInterface } from '@skeleton/types';

  definePageMeta({
    middleware: 'auth',
  });

  const { localizePath, findLocalesContentData } = useProjectMethods();
  const route = useRoute();

  const globalStore = useGlobalStore();
  const { contentLocalesArray } = storeToRefs(globalStore);

  const { getProfileFields } = useFieldsStore();
  const profileMenu = ref<{ id: string, title: string, url: string, seo: SeoContentInterface }[]>([]);

  const [contentRequest] = await Promise.all([
    useAsyncData('profileContent', () => queryContent('profile')
      .where({ locale: { $in: contentLocalesArray.value } }).find()),
    useAsyncData('profileFields', getProfileFields),
  ]);

  const { currentLocaleData, defaultLocaleData } = findLocalesContentData(contentRequest.data.value);
  const profileContent: Maybe<ProfileContentInterface> = currentLocaleData as ProfileContentInterface;
  const defaultLocaleProfileContent: Maybe<ProfileContentInterface> = defaultLocaleData as ProfileContentInterface;

  const profileContentObj = profileContent || defaultLocaleProfileContent;
  if (profileContentObj) {
    const filteredArray = Object.keys(profileContentObj).filter((key) => {
      if (profileContentObj[key]?.title) return key;
      return false;
    })
      .filter((item) => item !== 'notifications');

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

