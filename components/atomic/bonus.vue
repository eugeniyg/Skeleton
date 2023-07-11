<template>
  <div class="bonus">
    <nuxt-img v-if="props.image" class="img" :src="props.image"/>
    <div class="title">
      {{ props.title }}
    </div>
    <div v-if="props.description" class="sub-title">
      {{ props.description }}
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    image?: string,
    title: string,
    description?: string
  }>();
</script>

<style src="~/assets/styles/components/atomic/bonus.scss" lang="scss" />
