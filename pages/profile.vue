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
  import { ProfileContentInterface, SeoContentInterface } from '~/types';

  definePageMeta({
    middleware: 'auth',
  });

  const { localizePath } = useProjectMethods();
  const route = useRoute();

  const { getProfileFields } = useFieldsStore();
  const globalStore = useGlobalStore();
  const profileMenu = ref<{title: string, url: string, seo: SeoContentInterface }[]>([]);
  const { currentLocale } = storeToRefs(globalStore);
  const contentRequest = await useAsyncData('profileContent', () => queryContent(`profile/${currentLocale.value?.code}`).findOne());
  const profileContent:ProfileContentInterface|undefined = contentRequest.data.value as ProfileContentInterface;
  await useAsyncData('profileFields', getProfileFields);

  if (profileContent) {
    const filteredArray = Object.keys(profileContent).filter((key) => {
      if (profileContent[key]?.title) return key;
      return false;
    });
    profileMenu.value = filteredArray.map((key) => ({
      title: profileContent[key].title,
      url: `/profile/${key}`,
      seo: profileContent[key].seo,
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

    @include media(xs) {
      grid-template-columns: 1fr minmax(0, auto);
      grid-column-gap: rem(16px);
    }
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
