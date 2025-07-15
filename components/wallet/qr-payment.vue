<template>
  <div class="qr-payment">
    <div class="qr-payment__title">
      {{ getContent(walletContent, defaultLocaleWalletContent, 'deposit.qrPayment.title') }}
    </div>

    <div class="qr-payment__description">
      {{ getContent(walletContent, defaultLocaleWalletContent, 'deposit.qrPayment.description') }}
    </div>

    <div class="qr-payment__qr-code">
      <atomic-qr-code :width="176" :qr-address="props.qrAddress" />
    </div>

    <atomic-divider class="qr-payment__divider" />

    <div class="qr-payment__instruction">
      {{ getContent(walletContent, defaultLocaleWalletContent, 'deposit.qrPayment.instruction') }}
    </div>

    <button-base :is-disabled="copied" type="primary" size="lg" @click="copyQr">
      <template v-if="copied">
        <atomic-icon id="double-check" />
        {{ getContent(walletContent, defaultLocaleWalletContent, 'deposit.qrPayment.copiedLabel') }}
      </template>

      <template v-else>
        <atomic-icon id="copy" />
        {{ getContent(walletContent, defaultLocaleWalletContent, 'deposit.qrPayment.buttonLabel') }}
      </template>
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import copy from 'copy-to-clipboard';
  import type { IWalletModal } from '~/types';
  const props = defineProps<{
    qrAddress: string;
  }>();

  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');
  const copied = ref<boolean>(false);

  const copyQr = (): void => {
    copy(props.qrAddress);
    copied.value = true;
  };
</script>

<style src="~/assets/styles/components/wallet/qr-payment.scss" lang="scss" />
