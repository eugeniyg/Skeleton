<template>
  <div class="loyalty-benefits">
    <div class="loyalty-benefits__title" v-html="marked.parse(props.content.title)"/>
    <div class="loyalty-benefits__description" v-html="marked.parse(props.content.description)"/>
    
    <loyalty-benefits-tabs
      v-if="props.content?.tabs && props.content.display === 'tabs'"
      :content="props.content?.tabs"
    />
    <loyalty-benefits-grid
      v-else-if="props.content?.grid && props.content.display === 'grid'"
      :content="props.content?.grid"
    />
    
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import type { ILoyaltyPage } from '~/types';
  
  const props = defineProps<{
    content: ILoyaltyPage['benefits'];
  }>();
</script>

<style src="~/assets/styles/components/loyalty/benefits.scss" lang="scss"/>

