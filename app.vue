<template>
  <div>
    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
  const { currentLocale } = useGlobalStore();

  const layout = 'geo-restricted';

  useHead({
    htmlAttrs: {
      lang: currentLocale?.code
    },
  })
</script>
