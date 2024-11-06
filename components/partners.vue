<template>
  <div v-if="props.items?.length" class="partners">
    <div class="partners__title">{{ props.label }}</div>
    <div class="partners__items">
      <atomic-link
        v-for="(item, index) in props.items"
        :key="index"
        class="partners__item"
        :href="item.url"
        :target-blank="item.targetBlank"
      >
        <atomic-image class="partners__logo" :src="item.image" />
      </atomic-link>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    label: string;
    items: {
      url: string;
      image: string;
      targetBlank?: boolean;
    }[];
  }>();
</script>

<style src="@skeleton/assets/styles/components/partners.scss" lang="scss" />
