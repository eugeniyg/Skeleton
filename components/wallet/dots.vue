<template>
  <div class="wallet-dots">
    <div
      class="wallet-dots__item"
      :class="{ 'is-active': index === props.activeIndex }"
      :data-index="item"
      v-for="(item, index) in props.itemsCount"
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