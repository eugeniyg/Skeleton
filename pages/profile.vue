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

<style lang="scss">
.user-profile {
  display: flex;
  grid-gap: rem(24px);
  flex-direction: column;
  position: relative;
  align-items: flex-start;

  @include media(l) {
    grid-template-columns: auto 1px 1fr;
    grid-template-areas: "nav vr content";
    display: grid;

    &:after {
      content: '';
      display: block;
      height: 100%;
      width: 1px;
      background-color: var(--gray-700);
      grid-area: vr;
    }
  }

  .nav-profile {
    grid-area: nav;
    width: 100%;
  }

  > .content {
    grid-area: content;
    display: grid;
    grid-gap: rem(24px);
    width: 100%;

    > .items {
      display: grid;
      grid-row-gap: rem(8px);
    }
  }

  .header {
    display: grid;
    grid-row-gap: rem(16px);
    align-items: center;
    grid-template-columns: 1fr minmax(0, auto);
  }

  .heading {
    color: var(--white);
    padding: 0;
    margin: 0;
    @include font($heading-5);

    &:first-of-type {
      @include upd-font($heading-6);
    }
  }

  .group {
    display: grid;
    grid-gap: 16px;
  }

  .btn-load-more {
    margin: 0 auto;
  }

  .notifications {
    hr {
      display: none;
    }
  }
}
</style>
