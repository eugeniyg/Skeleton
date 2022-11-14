<template>
  <div>
    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
  const { countries, headerCountry } = useGlobalStore();

  const allowedCountry = headerCountry ? countries.find((country) => country.code === headerCountry) : true;
  const layout = allowedCountry ? 'default' : 'locked';
</script>
