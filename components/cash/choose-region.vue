<template>
  <div class="cash-choose-region">
    <atomic-image :src="props.src"/>
    <div class="cash-choose-region__label">{{ props.label }}</div>
    <span class="cash-choose-region__title">{{ props.title }}</span>
    <span class="cash-choose-region__change" @click="showModal('chooseRegion')">{{ props.linkText }}</span>
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

<style src="~/assets/styles/components/cash/choose-region.scss" lang="scss" />
