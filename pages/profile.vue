<template>
  <div class="user-profile">
    <nav-profile v-if="profileMenu.length" :items="profileMenu"/>

    <client-only>
      <NuxtPage />
    </client-only>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ProfileContentInterface } from '~/types';

  const { localizePath } = useProjectMethods();
  const { needToChangeLanguage } = useProjectMethods();

  if (!needToChangeLanguage()) {
    const route = useRoute();
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
  const profileContent = ref<ProfileContentInterface|undefined>(undefined);
  const profileMenu = ref<{title: string, url: string }[]>([]);
  const { currentLocale } = storeToRefs(globalStore);
  const contentRequest = await useAsyncData('profileContent', () => queryContent(`profile/${currentLocale.value.code}`).findOne());
  profileContent.value = contentRequest.data.value as ProfileContentInterface;
  await useAsyncData('profileFields', getProfileFields);

  if (profileContent.value) {
    const filteredArray = Object.keys(profileContent.value).filter((key) => {
      if (profileContent.value[key]?.title) return key;
      return false;
    });
    profileMenu.value = filteredArray.map((key) => ({
      title: profileContent.value[key].title,
      url: localizePath(`/profile/${key}`),
    }));
  }
</script>

<style lang="scss" src="./profile/style.scss"/>
