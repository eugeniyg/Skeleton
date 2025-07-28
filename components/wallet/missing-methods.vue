<template>
  <div class="missing-methods">
    <atomic-picture v-if="image" class="missing-methods__picture" :src="image" />

    <div class="missing-methods__title">
      {{ getContent(walletContent, defaultLocaleWalletContent, 'missingMethods.title') }}
    </div>
    <div class="missing-methods__description">{{ missingMethodsDescription }}</div>
  </div>
</template>

<script setup lang="ts">
  import type { IWalletModal } from '~/types';

  const props = defineProps<{
    selectedTab: 'deposit' | 'withdraw';
  }>();

  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');

  const missingMethodsDescription = computed(() => {
    if (props.selectedTab === 'deposit') {
      return getContent(walletContent, defaultLocaleWalletContent, 'missingMethods.depositDescription');
    } else if (props.selectedTab === 'withdraw') {
      return getContent(walletContent, defaultLocaleWalletContent, 'missingMethods.withdrawDescription');
    }
    return '';
  });

  const image = computed(() => getContent(walletContent, defaultLocaleWalletContent, 'missingMethods.image'));
</script>

<style src="~/assets/styles/components/wallet/missing-methods.scss" lang="scss" />
