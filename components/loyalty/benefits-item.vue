<template>
  <div class="loyalty-benefits-item">
    <div class="loyalty-benefits-item__title">{{ props.title }}</div>
    <div class="loyalty-benefits-item__description">{{ props.description }}</div>
    <div class="loyalty-benefits-item__image">
      <atomic-image
        class="loyalty-benefits-item__image-back-bg"
        src="/img/loyalty/default-level-bg.png"
      />
      <atomic-image :src="props.image" class="loyalty-benefits-item__image-front-bg"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    title: string;
    description: string;
    image: string;
  }>();
</script>

<style src="~/assets/styles/components/loyalty/benefits-item.scss" lang="scss"/>