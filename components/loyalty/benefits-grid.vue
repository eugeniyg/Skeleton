<template>
  <div class="loyalty-benefits-grid">
    <div class="loyalty-benefits-grid__items" :class="{ 'is-numeric': props.numberedList }">
      <loyalty-benefits-item
        v-for="(benefit, index) in props.items"
        v-bind="benefit"
        :key="index"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IBenefitsTab } from '~/types';

  const props = defineProps<{
    items: IBenefitsTab['benefits'];
    numberedList?: boolean;
  }>();
</script>

<style src="~/assets/styles/components/loyalty/benefits-grid.scss" lang="scss"/>