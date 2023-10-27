<template>
  <div class="cash-header">
    <div class="cash-header__logo">
      <atomic-image :src="props.src"/>
    </div>
    <div class="cash-header__title">{{ props.title }}</div>
    <div class="cash-header__sub-title">{{ props.subTitle }}</div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    title: string,
    subTitle: string,
    src: string,
  }>()
</script>

<style src="~/assets/styles/components/cash/header.scss" lang="scss"/>