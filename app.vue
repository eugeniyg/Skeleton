<template>
  <NuxtLayout :name="layout">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
  const { countries } = useGlobalStore();
  const { getRequestCountry } = useProjectMethods();

  const headersCountry = getRequestCountry();
  const allowedCountry = headersCountry ? countries.find((country) => country.code.toUpperCase() === headersCountry.toUpperCase()) : true;
  const layout = allowedCountry ? 'default' : 'locked';
</script>
