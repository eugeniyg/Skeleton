<template>
  <div>
    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
  import type { ILocale } from '@skeleton/api/types';

  const { currentLocale, countries, headerCountry, locales } = useGlobalStore();

  const isCurrentCountryRestrict = (): boolean | undefined => {
    if (!headerCountry) return undefined;
    const currentCountryObj = countries.find(country => country.code === headerCountry.toUpperCase());

    return currentCountryObj?.restrict && currentCountryObj?.restrictType === 1;
  };
  const layout = isCurrentCountryRestrict() ? 'geo-restricted' : 'default';
  const { origin } = useRequestURL();
  const route = useRoute();
  const getPageLink = (locale: ILocale): string => {
    const routerLocale: any = route.params.locale;
    const pathRegexp = new RegExp(`^/${routerLocale}/|^/${routerLocale}$`);
    const pathWithoutLocale = routerLocale ? route.fullPath.replace(pathRegexp, '/') : route.fullPath;

    if (locale.isDefault) return pathWithoutLocale;
    return `/${locale.code.toLowerCase()}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
  };

  const alternateLinks = computed(() => {
    return (
      locales.map(locale => {
        return {
          rel: 'alternate',
          hreflang: locale.code,
          href: `${origin}${getPageLink(locale)}`,
        };
      }) || []
    );
  });

  const pageUrl = computed(() => {
    return `${origin}${route.fullPath}`;
  });

  useHead({
    htmlAttrs: {
      lang: currentLocale?.code,
    },
    link: alternateLinks,
    meta: [
      {
        property: 'og:url',
        content: pageUrl,
      },
    ],
  });
</script>
