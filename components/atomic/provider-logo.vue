<template>
  <atomic-image class="provider-logo" :src="logoSrc" defaultImage="/img/provider-empty-placeholder.svg" />
</template>

<script setup lang="ts">
  import type { IGameProvider } from '@skeleton/core/types';

  const props = defineProps<{
    providerData: IGameProvider;
  }>();

  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = useGlobalStore();
  const { getContent } = useProjectMethods();
  const { public: config } = useRuntimeConfig();
  const logoSrc = computed(() => {
    if (props.providerData?.customImages?.['116x40'] && config.customerCdn) {
      const mainPath =
        props.providerData?.customImages['116x40']?.['3x'] ||
        props.providerData?.customImages['116x40']?.['2x'] ||
        props.providerData?.customImages['116x40']['1x'];
      return `${config.customerCdn}${mainPath}`;
    }

    if (props.providerData?.images?.['116x40'] && config.gamehubCdn) {
      const mainPath =
        props.providerData?.images['116x40']?.['3x'] ||
        props.providerData?.images['116x40']?.['2x'] ||
        props.providerData?.images['116x40']['1x'];
      return `${config.gamehubCdn}${mainPath}`;
    }

    return (
      getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'providersSettings.defaultLogo') ||
      '/img/provider-empty-placeholder.svg'
    );
  });
</script>
