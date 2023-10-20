<template>
  <div class="page-providers">
    <div class="page-providers__header">
      <div class="page-providers__heading">
        {{ getContent(providersContent, defaultLocaleProvidersContent, 'title') }}
      </div>

      <div class="page-providers__count">
        {{ gameProviders?.length || 0 }} {{ getContent(providersContent, defaultLocaleProvidersContent, 'providersLabel') }}
      </div>

      <div class="page-providers__filter">
        <providers-filter />
      </div>
    </div>

    <list-providers
      :currentLocaleContent="providersContent"
      :defaultLocaleContent="defaultLocaleProvidersContent"
    />
  </div>
</template>

<script setup lang="ts">
  import { IProvidersPage } from "~/types";
  import { storeToRefs } from "pinia";

  const globalStore = useGlobalStore();
  const gamesStore = useGamesStore();

  const {
    currentLocale,
    defaultLocale,
  } = storeToRefs(globalStore);

  const {
    setPageSeo,
    getContent,
    getLocalesContentData,
  } = useProjectMethods();

  const { gameProviders } = storeToRefs(gamesStore);

  const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
    useAsyncData('currentLocaleProvidersPageContent', () => queryContent(currentLocale.value?.code as string, 'pages', 'providers').findOne()),
    currentLocale.value?.isDefault ? Promise.reject('Current locale is default locale!')
      : useAsyncData('defaultLocaleProvidersPageContent', () => queryContent(defaultLocale.value?.code as string, 'pages', 'providers').findOne())
  ]);

  const { currentLocaleData, defaultLocaleData } = getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);

  const providersContent: Maybe<IProvidersPage> = currentLocaleData;
  const defaultLocaleProvidersContent: Maybe<IProvidersPage> = defaultLocaleData;
  setPageSeo(providersContent?.seo);
</script>

<style src="~/assets/styles/pages/providers.scss" lang="scss" />