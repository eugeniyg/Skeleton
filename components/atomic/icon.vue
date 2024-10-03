<template>
  <svg v-if="props.id" xmlns="http://www.w3.org/2000/svg" class="icon">
    <use :xlink:href="`/sprite.svg#${props.id}`" :href="`/sprite.svg#${props.id}`"/>
  </svg>
</template>

<script setup lang="ts">
  const props = defineProps<{
    id: Maybe<string>
  }>();
</script>

<style src="~/assets/styles/components/atomic/icon.scss" lang="scss" />
