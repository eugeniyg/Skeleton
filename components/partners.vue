<template>
  <div class="partners" v-if="props.items?.length">
    <div class="partners__title">{{ props.label }}</div>
    <div class="partners__items">
      <a class="partners__item" v-for="item in props.items" :href="item.url" target=”_blank”>
        <atomic-image class="partners__logo" :src="item.image"/>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    label: string,
    items: {
      url: string,
      image: string
    }[]
  }>();
</script>

<style src="@skeleton/assets/styles/components/partners.scss" lang="scss" />
