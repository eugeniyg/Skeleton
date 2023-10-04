<template>
  <div class="card-cat" :class="`card-cat-${props.mod}`">
    <div class="card-cat__title">
      {{ props.title }}
    </div>

    <div class="card-cat__sub-title">{{ props.description }}</div>

    <atomic-picture
      v-if="props.image"
      class="card-cat__img"
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
    mod: string,
    title: string,
    description: string,
    button: {
      label: string,
      url: string
    }
  }>();
</script>

<style src="~/assets/styles/components/card/category.scss" lang="scss" />

