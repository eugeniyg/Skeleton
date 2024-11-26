<template>
  <div class="wallet-destination-tag">
    <form-input-copy
      name="destinationTag"
      :label="getContent(walletContent, defaultLocaleWalletContent, 'deposit.destinationTag.label')"
      :value="props.value"
      :copy-tooltip="getContent(walletContent, defaultLocaleWalletContent, 'deposit.copiedLabel')"
    />

    <wallet-warning :content="warningContent" />
  </div>
</template>

<script setup lang="ts">
  import type { IWalletModal } from '~/types';

  const props = defineProps<{
    value?: string;
  }>();

  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');
  const { getContent } = useProjectMethods();
  const warningContent = computed(() => ({
    description: getContent(walletContent, defaultLocaleWalletContent, 'deposit.destinationTag.warning'),
  }));
</script>
