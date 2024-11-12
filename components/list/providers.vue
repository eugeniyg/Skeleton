<template>
  <div class="list-providers">
    <div v-if="props.staticProvider" class="list-providers__item is-accented">
      <atomic-picture
        class="list-providers__item-logo"
        :src="getContent(currentLocaleContent, defaultLocaleContent, 'defaultProviderLogo')"
      />

      <div class="list-providers__item-info">
        <div class="list-providers__item-label">{{ props.staticProvider?.name }}</div>

        <div class="list-providers__item-count">
          {{ props.staticProvider?.gameEnabledCount || 0 }}
          {{ getContent(currentLocaleContent, defaultLocaleContent, 'gamesLabel') }}
        </div>

        <button-base type="primary" :url="`/games?provider=${props.staticProvider.id}`">
          {{ getContent(currentLocaleContent, defaultLocaleContent, 'staticProvider.button') }}
        </button-base>
      </div>

      <div class="list-providers__item-bg">
        <atomic-picture :src="getContent(currentLocaleContent, defaultLocaleContent, 'staticProvider.bgImage')" />
      </div>
    </div>

    <nuxt-link
      v-for="provider in props.providersList"
      :key="provider.id"
      :to="localizePath(`/games?provider=${provider.id}`)"
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
  import type { IProvidersPage } from '~/types';
  import type { IGameProvider } from '@skeleton/core/types';

  const props = defineProps<{
    staticProvider?: IGameProvider;
    providersList: IGameProvider[];
    currentLocaleContent: Maybe<IProvidersPage>;
    defaultLocaleContent: Maybe<IProvidersPage>;
  }>();

  const { getContent, localizePath } = useProjectMethods();
</script>

<style src="~/assets/styles/components/list/providers.scss" lang="scss" />
