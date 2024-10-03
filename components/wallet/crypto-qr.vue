<template>
  <div class="qr">
    <div class="title">{{ props.content?.addressTitle }}</div>
    <div class="description">{{ props.content?.addressDescription }}</div>

    <div class="box">
      <atomic-qr-code :width="116" :qrAddress="props.qrAddress" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IWalletDeposit } from '~/types';

  const props = defineProps<{
    content: Maybe<IWalletDeposit>,
    qrAddress: string
  }>();
</script>

<style src="~/assets/styles/components/wallet/crypto-qr.scss" lang="scss" />
