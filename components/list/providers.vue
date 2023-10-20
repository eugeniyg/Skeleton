<template>
  <div class="list-providers">
    <div class="list-providers__item is-accented">
      <atomic-picture
        class="list-providers__item-logo"
        :src="getContent(currentLocaleContent, defaultLocaleContent, 'defaultProviderLogo')"
      />

      <div class="list-providers__item-info">
        <div class="list-providers__item-label">{{ staticProviderInfo?.name }}</div>

        <div class="list-providers__item-count">
          {{ staticProviderInfo?.gameEnabledCount || 0 }} {{ getContent(currentLocaleContent, defaultLocaleContent, 'gamesLabel') }}
        </div>

        <button-base type="primary" :url="`/games?provider=${staticProviderInfo.identity}`">
          {{ getContent(currentLocaleContent, defaultLocaleContent, 'staticProvider.button') }}
        </button-base>
      </div>

      <div class="list-providers__item-bg">
        <atomic-picture :src="getContent(currentLocaleContent, defaultLocaleContent, 'staticProvider.bgImage')" />
      </div>
    </div>

    <nuxt-link
      v-for="provider in providersList"
      :to="localizePath(`/games?provider=${provider.identity}`)"
      class="list-providers__item"
    >
      <atomic-picture
        class="list-providers__item-logo"
        :src="getContent(currentLocaleContent, defaultLocaleContent, 'defaultProviderLogo')"
      />

      <div class="list-providers__item-info">
        <div class="list-providers__item-label">{{ provider.name }}</div>
        <div class="list-providers__item-count">
          {{ provider.gameEnabledCount }} {{ getContent(currentLocaleContent, defaultLocaleContent, 'gamesLabel') }}
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
  import { IProvidersPage } from "~/types";
  import {storeToRefs} from "pinia";

  const props = defineProps<{
    currentLocaleContent: Maybe<IProvidersPage>,
    defaultLocaleContent: Maybe<IProvidersPage>
  }>();

  const gamesStore = useGamesStore();
  const { gameProviders } = storeToRefs(gamesStore);

  const {
    getContent,
    localizePath
  } = useProjectMethods();

  const staticProviderIdentity = getContent(
    props.currentLocaleContent,
    props.defaultLocaleContent,
    'staticProvider.identity'
  );

  const staticProviderInfo = computed(() => {
    return gameProviders.value.find(provider => provider.identity === staticProviderIdentity);
  });

  const providersList = computed(() => {
    return gameProviders.value.filter(provider => provider.identity !== staticProviderIdentity);
  })
</script>

<style src="~/assets/styles/components/list/providers.scss" lang="scss"/>