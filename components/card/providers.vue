<template>
  <nuxt-link class="card-providers" :to="routerLink">
    <div class="card-providers__header">
      <atomic-image class="card-providers__img" :src="`/img/providers/${props.providerData.identity}.svg`" />
    </div>

    <div class="card-providers__info">
      <div class="card-providers__name">{{ props.providerData.name }}</div>
      <div class="card-providers__count">
        <span>{{ props.providerData.gameEnabledCount }}</span>
        <span>games</span>
      </div>
    </div>
  </nuxt-link>
</template>

<script setup lang="ts">
  import type { IGameProvider } from '@skeleton/core/types';
  import { storeToRefs } from 'pinia';

  const props = defineProps<{
    providerData: IGameProvider;
  }>();

  const { getContent, localizePath } = useProjectMethods();
  const globalStore = useGlobalStore();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = storeToRefs(globalStore);
  const defaultCategory = computed(() =>
    getContent(
      globalComponentsContent.value,
      defaultLocaleGlobalComponentsContent.value,
      'providersSettings.defaultCategory'
    )
  );
  const routerLink = computed(() => {
    return localizePath(
      defaultCategory.value
        ? `/categories/${defaultCategory.value}?provider=${props.providerData.identity}`
        : `/categories?provider=${props.providerData.identity}`
    );
  });
</script>

<style src="~/assets/styles/components/card/providers.scss" lang="scss" />
