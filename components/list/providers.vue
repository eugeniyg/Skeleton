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

        <button-base
          type="primary"
          :url="
            defaultCategory
              ? `/categories/${defaultCategory}?provider=${props.staticProvider.identity}`
              : `/categories?provider=${props.staticProvider.identity}`
          "
        >
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
      :to="
        localizePath(
          defaultCategory
            ? `/categories/${defaultCategory}?provider=${provider.identity}`
            : `/categories?provider=${provider.identity}`
        )
      "
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
  import { storeToRefs } from 'pinia';

  const props = defineProps<{
    staticProvider?: IGameProvider;
    providersList: IGameProvider[];
    currentLocaleContent: Maybe<IProvidersPage>;
    defaultLocaleContent: Maybe<IProvidersPage>;
  }>();

  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = storeToRefs(globalStore);
  const { getContent, localizePath } = useProjectMethods();
  const defaultCategory = computed(() =>
    getContent(
      globalComponentsContent.value,
      defaultLocaleGlobalComponentsContent.value,
      'providersSettings.defaultCategory'
    )
  );
</script>

<style src="~/assets/styles/components/list/providers.scss" lang="scss" />
