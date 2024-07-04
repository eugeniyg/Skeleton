<template>
  <div class="loyalty-benefits-item">
    <div class="loyalty-benefits-item__title">{{ props.title }}</div>
    <div class="loyalty-benefits-item__description" v-html="marked.parse(props.description)"/>
    <div class="loyalty-benefits-item__image">
      <atomic-image
        class="loyalty-benefits-item__image-back-bg"
        src="/img/uploads/loyalty-rays.png"
      />
      <atomic-image :src="props.image" class="loyalty-benefits-item__image-front-bg"/>
    </div>
    
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  
  const props = defineProps<{
    title: string;
    description: string;
    image: string;
  }>();
</script>

<style src="~/assets/styles/components/loyalty/benefits-item.scss" lang="scss"/>
