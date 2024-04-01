<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
  const profileStore = useProfileStore();
  const { tokenCookieKey, sessionConfirmed } = storeToRefs(profileStore);
  const sessionToken = useCookie(tokenCookieKey.value);

  const router = useRouter();
  watch(() => sessionToken.value, (newToken) => {
    const needReload = (!newToken && sessionConfirmed.value) || (newToken && !sessionConfirmed.value);
    if (needReload) router.go(0);
  })

  onMounted(() => {
    console.log('app mounted');
  })
</script>
