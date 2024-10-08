<template>
  <div class="wallet-region">
    <atomic-image
      :src="paymentMethodsGeo ? `/img/flags/${paymentMethodsGeo}.svg` : '/img/flags/placeholder.png'"
      defaultImage="/img/flags/placeholder.png"
    />

    <div class="wallet-region__label">
      {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.regionBlock.label') }}
    </div>

    <span class="wallet-region__title">
      {{ selectedRegionName }}
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
  const { popupsData, defaultLocalePopupsData, countriesSelectOptions } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();
  const walletStore = useWalletStore();
  const { paymentMethodsGeo } = storeToRefs(walletStore);

  const selectedRegionName = computed(() => {
    const countryOption = countriesSelectOptions.value.find(country => country.code === paymentMethodsGeo.value);
    const unknownLabel = getContent(popupsData.value, defaultLocalePopupsData.value, 'wallet.regionBlock.unknown');
    return countryOption?.name || unknownLabel || 'Unknown Region';
  });
</script>

<style src="~/assets/styles/components/wallet/region.scss" lang="scss" />