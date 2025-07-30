<template>
  <atomic-image class="provider-logo" :src="logoSrc" defaultImage="/img/provider-empty-placeholder.svg" />
</template>

<script setup lang="ts">
  import type { IGameProvider } from '@skeleton/api/types';
  import { getProviderImageUrl } from '@skeleton/helpers/urlBuildMethods';

  const props = defineProps<{
    providerData: IGameProvider;
  }>();

  const logoSrc = computed(() => getProviderImageUrl(props.providerData));
</script>
