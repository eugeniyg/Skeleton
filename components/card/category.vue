<template>
  <div
    class="card-category"
    :class="`card-category--${props.mod}`"
    :style="backgroundGradientStyle"
  >
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
    colorLeft: string,
    colorRight: string,
    button: {
      label: string,
      url: string
    }
  }>();
  
  const backgroundGradientStyle = computed(() => `background: linear-gradient(to right, ${props.colorLeft}, ${props.colorRight})`);
</script>

<style src="~/assets/styles/components/card/category.scss" lang="scss" />

