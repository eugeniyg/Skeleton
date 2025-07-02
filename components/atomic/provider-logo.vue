<template>
  <atomic-image class="provider-logo" :src="logoSrc" defaultImage="/img/provider-empty-placeholder.svg" />
</template>

<script setup lang="ts">
  import type { IGameProvider } from '@skeleton/core/types';

  const props = defineProps<{
    providerData: IGameProvider;
  }>();

  const { getProviderImageUrl } = useProjectMethods();
  const logoSrc = computed(() => getProviderImageUrl(props.providerData));
</script>
