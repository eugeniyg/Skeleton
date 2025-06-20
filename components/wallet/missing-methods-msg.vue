<template>
  <div class="missing-methods-msg">
    <atomic-icon id="info" class="missing-methods-msg__icon" />

    <span class="missing-methods-msg__text">
      {{ getContent(walletContent, defaultLocaleWalletContent, 'missingMethods.message') }}
    </span>
  </div>
</template>

<script setup lang="ts">
  import type { IWalletModal } from '~/types';

  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');
  const { getContent } = useProjectMethods();
</script>

<style src="~/assets/styles/components/wallet/missing-methods-msg.scss" lang="scss" />
