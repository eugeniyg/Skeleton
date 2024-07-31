<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
  const { currentLocale } = useGlobalStore();

  useHead({
    htmlAttrs: {
      lang: currentLocale?.code
    },
  })
</script>
