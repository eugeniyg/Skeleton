<template>
  <div class="card-category" :class="`card-category--${props.mod}`">
    <div class="card-category__title">
      {{ props.title }}
    </div>

    <div class="card-category__sub-title">{{ props.description }}</div>

    <atomic-picture
      v-if="props.image"
      class="card-category__picture"
      :src="props.image"
    />

    <button-base
      type="secondary"
      size="md"
      :url="props.button.url"
    >
      {{ props.button.label }}
    </button-base>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    image?: string,
    mod: number,
    title: string,
    description: string,
    button: {
      label: string,
      url: string
    }
  }>();
</script>

<style src="~/assets/styles/components/card/category.scss" lang="scss" />

