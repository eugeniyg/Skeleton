<template>
  <div class="loyalty-benefits-grid">
    <div class="loyalty-benefits-grid__items" :class="{'is-numeric': props.content.isNumeric}">
      <loyalty-benefits-item v-for="item in props.content.items" v-bind="item"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ILoyaltyPage } from '~/types';
  
  const props = defineProps<{
    content: ILoyaltyPage['benefits']['grid'];
  }>();
  
</script>

<style src="~/assets/styles/components/loyalty/benefits-grid.scss" lang="scss"/>
