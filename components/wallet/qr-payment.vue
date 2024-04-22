<template>
  <div class="qr-payment">
    <div class="qr-payment__title">
      {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.qrPayment.title') }}
    </div>

    <div class="qr-payment__description">
      {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.qrPayment.description') }}
    </div>


    <div class="qr-payment__qr-code">
      <atomic-qr-code :width="176" :qrAddress="props.qrAddress" />
    </div>

    <atomic-divider class="qr-payment__divider" />

    <div class="qr-payment__instruction">
      {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.qrPayment.instruction') }}
    </div>

    <button-base :isDisabled="copied" type="primary" size="lg" @click="copyQr">
      <template v-if="copied">
        <atomic-icon id="double-check"/>
        {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.qrPayment.copiedLabel') }}
      </template>

      <template v-else>
        <atomic-icon id="copy"/>
        {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.qrPayment.buttonLabel') }}
      </template>
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import copy from "copy-to-clipboard";
  const props = defineProps<{
    qrAddress: string;
  }>();

  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent } = useProjectMethods();
  const copied = ref<boolean>(false);

  const copyQr = ():void => {
    copy(props.qrAddress);
    copied.value = true;
  }
</script>

<style src="~/assets/styles/components/wallet/qr-payment.scss" lang="scss" />
