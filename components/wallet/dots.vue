<template>
  <div class="wallet-dots">
    <div
      v-for="(item, index) in props.itemsCount"
      :key="index"
      class="wallet-dots__item"
      :class="{ 'is-active': index === props.activeIndex }"
      :data-index="item"
    />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    itemsCount: number;
    activeIndex: number;
  }>();
</script>

<style src="~/assets/styles/components/wallet/dots.scss" lang="scss"/>