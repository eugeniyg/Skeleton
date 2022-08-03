<template>
  <div class="user-profile">
    <nav-profile :items="menu.profile"/>

    <client-only>
      <NuxtPage :key="`profile-child${$route.fullPath}`" />
    </client-only>
  </div>
</template>

<script setup lang="ts">
  const { getProfileFields } = useFieldsStore();
  await useAsyncData('profileFields', getProfileFields);

  const { menu } = useFakeStore();

  definePageMeta({
    middleware: () => {
      const { localizePath } = useProjectMethods();
      const bearer = useCookie('bearer');
      const router = useRouter();

      if (!bearer.value) {
        return router.replace(localizePath('/'));
        // return navigateTo(localizePath('/'));
      } return true;
    },
  });
</script>

<style lang="scss" src="./profile/style.scss"/>
