<template>
  <div class="wallet-region">
    <atomic-image :src="props.src"/>
    <div class="wallet-region__label">{{ props.label }}</div>
    <span class="wallet-region__title">{{ props.title }}</span>

    <span
      class="wallet-region__change"
      @click="showModal('walletRegion')"
    >
      {{ props.linkText }}
    </span>

    <slot/>
  </div>
</template>

<script setup lang="ts">
const layoutStore = useLayoutStore();
const { showModal } = layoutStore;

const props = defineProps<{
  src: string,
  label: string,
  title: string,
  linkText: string,
}>();
</script>

<style src="~/assets/styles/components/wallet/region.scss" lang="scss" />