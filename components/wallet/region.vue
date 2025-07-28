<template>
  <div class="wallet-region">
    <atomic-image :src="regionImage" default-image="/img/flags/placeholder.png" />

    <div class="wallet-region__label">
      {{ getContent(walletContent, defaultLocaleWalletContent, 'regionBlock.label') }}
    </div>

    <span class="wallet-region__title">
      {{ selectedRegionName }}
    </span>

    <span class="wallet-region__change" @click="openModal('wallet-region')">
      {{ getContent(walletContent, defaultLocaleWalletContent, 'regionBlock.change') }}
    </span>
  </div>
</template>

<script setup lang="ts">
  import type { IWalletModal } from '~/types';

  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');
  const { openModal } = useModalStore();
  const globalStore = useGlobalStore();
  const { countriesSelectOptions } = storeToRefs(globalStore);
  const walletStore = useWalletStore();
  const { selectedPaymentMethodsRegion } = storeToRefs(walletStore);

  const selectedRegionName = computed(() => {
    const countryOption = countriesSelectOptions.value.find(
      country => country.code === selectedPaymentMethodsRegion.value
    );
    const unknownLabel = getContent(walletContent, defaultLocaleWalletContent, 'regionBlock.unknown');
    return countryOption?.name || unknownLabel || 'Unknown Region';
  });

  const regionImage = computed(() => {
    return selectedPaymentMethodsRegion.value
      ? `/img/flags/${selectedPaymentMethodsRegion.value.toLowerCase()}.svg`
      : '/img/flags/placeholder.png';
  });
</script>

<style src="~/assets/styles/components/wallet/region.scss" lang="scss" />
