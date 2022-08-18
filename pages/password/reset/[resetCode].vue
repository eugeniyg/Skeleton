<template>
  <div/>
</template>

<script setup lang="ts">
  const { needToChangeLanguage } = useProjectMethods();

  if (!needToChangeLanguage()) {
    const { localizePath } = useProjectMethods();
    const route = useRoute();
    navigateTo(localizePath(`/?reset-pass=true&resetCode=${route.params.resetCode}`), { replace: true });
  }
</script>
