<template>
  <div>
    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
  const { currentLocale, countries, headerCountry } = useGlobalStore();

  const isCurrentCountryRestrict = (): boolean|undefined => {
    console.log('headerCountry: ', headerCountry);
    if (!headerCountry) return undefined;
    const currentCountryObj = countries.find(country => country.code === headerCountry.toUpperCase());
    console.log('currentCountryObj: ', currentCountryObj);
    console.log('restrict: ', currentCountryObj?.restrict);

    return currentCountryObj?.restrict;
  }
  const layout = isCurrentCountryRestrict() ? 'geo-restricted' : 'default';

  useHead({
    htmlAttrs: {
      lang: currentLocale?.code
    },
  })
</script>
