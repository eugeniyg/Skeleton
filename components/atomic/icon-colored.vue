<template>
  <svg v-if="props.id" xmlns="http://www.w3.org/2000/svg" class="icon-colored">
    <use :xlink:href="`/sprite.svg#${props.id}`" :href="`/sprite-colored.svg#${props.id}`"></use>
  </svg>
</template>

<script setup lang="ts">
  const props = defineProps<{
    id: Maybe<string>
  }>();
</script>
