<template>
  <svg xmlns="http://www.w3.org/2000/svg" class="icon">
    <use :xlink:href="`/sprite.svg#${props.id}`" :href="`/sprite.svg#${props.id}`"></use>
  </svg>
</template>

<script setup lang="ts">
  const props = defineProps({
    id: {
      type: String,
      required: true,
    },
  });
</script>

<style lang="scss" src="./style.scss"/>
