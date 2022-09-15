<template>
  <div>
    <div class="user-profile">
      <nav-profile v-if="profileMenu.length" :items="profileMenu"/>

      <client-only>
        <NuxtPage />
      </client-only>
    </div>

    <atomic-seo-text v-if="activePageSeo?.text" v-bind="activePageSeo?.text" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ProfileContentInterface, SeoContentInterface } from '~/types';

  const { localizePath } = useProjectMethods();
  const { needToChangeLanguage } = useProjectMethods();

  const route = useRoute();
  if (!needToChangeLanguage()) {
    const bearer = useCookie('bearer');

    if (route.params.confirmCode) {
      const { confirmProfile } = useCoreProfileApi();
      try {
        await confirmProfile(route.params.confirmCode as string);
        navigateTo(localizePath('/?confirm=true'), { replace: true });
      } catch {
        navigateTo(localizePath('/'), { replace: true });
      }
    } else if (!bearer.value) {
      navigateTo(localizePath('/'), { replace: true });
    }
  }

  const { getProfileFields } = useFieldsStore();
  const globalStore = useGlobalStore();
  const profileMenu = ref<{title: string, url: string, seo: SeoContentInterface }[]>([]);
  const { currentLocale } = storeToRefs(globalStore);
  const contentRequest = await useAsyncData('profileContent', () => queryContent(`profile/${currentLocale.value.code}`).findOne());
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

<style lang="scss" src="./profile/style.scss"/>
