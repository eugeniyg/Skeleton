<template>
  <div class="wallet-region">
    <atomic-image :src="'/img/flags/us.svg'"/>
    <div class="wallet-region__label">
      {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.regionBlock.label') }}
    </div>

    <span class="wallet-region__title">
      Developer
    </span>

    <span
      class="wallet-region__change"
      @click="showModal('walletRegion')"
    >
      {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.regionBlock.change') }}
    </span>
  </div>
</template>

<script setup lang="ts">
  const layoutStore = useLayoutStore();
  const { showModal } = layoutStore;
  const globalStore = useGlobalStore();
  const { popupsData, defaultLocalePopupsData } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();
</script>

<style src="~/assets/styles/components/wallet/region.scss" lang="scss" />