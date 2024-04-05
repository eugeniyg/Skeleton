<template>
  <div class="partners" v-if="props.items?.length">
    <div class="partners__title">{{ props.label }}</div>
    <div class="partners__items">
      <atomic-link
          class="partners__item"
          v-for="item in props.items"
          :href="item.url"
          :targetBlank="item.targetBlank"
      >
        <atomic-image class="partners__logo" :src="item.image"/>
      </atomic-link>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    label: string,
    items: {
      url: string,
      image: string
      targetBlank?: boolean
    }[]
  }>();
</script>

<style src="@skeleton/assets/styles/components/partners.scss" lang="scss" />
