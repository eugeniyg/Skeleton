<template>
  <div id="wallet-await-invoice" class="await-invoice">
    <atomic-image v-if="image" :src="image" width="72" height="72" />

    <div class="await-invoice__title">
      {{ getContent(walletContent, defaultLocaleWalletContent, 'deposit.awaitInvoice.title') }}
    </div>

    <div class="await-invoice__description">
      {{ getContent(walletContent, defaultLocaleWalletContent, 'deposit.awaitInvoice.description') }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IWalletModal } from '~/types';

  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');
  const { getContent } = useProjectMethods();
  const image = getContent(walletContent, defaultLocaleWalletContent, 'deposit.awaitInvoice.image');
</script>

<style src="~/assets/styles/components/wallet/await-invoice.scss" lang="scss" />
