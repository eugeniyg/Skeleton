<template>
  <div class="rewards-slider-item">
    <pre style="color:white">{{ props.content }}</pre>
  </div>
</template>

<script setup lang="ts">
  import type { ILoyaltyPage } from '~/types';
  
  const props = defineProps<{
    content: ILoyaltyPage['rewards']['slider']
  }>()
</script>
