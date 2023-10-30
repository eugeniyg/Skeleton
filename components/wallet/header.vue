<template>
  <div class="wallet-header">
    <div class="wallet-header__logo">
      <atomic-image :src="props.src"/>
    </div>

    <div class="wallet-header__title">{{ props.title }}</div>
    <div class="wallet-header__sub-title">{{ props.subTitle }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string,
  subTitle: string,
  src: string,
}>()
</script>

<style src="~/assets/styles/components/wallet/header.scss" lang="scss"/>