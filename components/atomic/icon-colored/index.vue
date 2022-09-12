<template>
  <svg xmlns="http://www.w3.org/2000/svg" class="icon-colored">
    <use :xlink:href="`/sprite.svg#${props.id}`" :href="`/svg-sprite.svg#${props.id}`"></use>
  </svg>
</template>

<script setup lang="ts">
  const props = defineProps<{id: string}>();
</script>

<style lang="scss" src="./style.scss"/>
