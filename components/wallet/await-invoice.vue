<template>
  <div id="wallet-await-invoice" class="await-invoice">
    <atomic-image v-if="image" :src="image" width="72" height="72" />

    <div class="await-invoice__title">
      {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.awaitInvoice.title') }}
    </div>

    <div class="await-invoice__description">
      {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.awaitInvoice.description') }}
    </div>
  </div>
</template>

<script setup lang="ts">
  const globalStore = useGlobalStore();
  const { popupsData, defaultLocalePopupsData } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();

  const image = computed(() => {
    return getContent(popupsData.value, defaultLocalePopupsData.value, 'wallet.deposit.awaitInvoice.image');
  });
</script>

<style src="~/assets/styles/components/wallet/await-invoice.scss" lang="scss" />
