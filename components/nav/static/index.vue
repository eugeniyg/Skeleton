<template>
  <div class="nav-static">
    <a v-for="(item, itemIndex) in props.items" :key="itemIndex" href="#">{{ item }}</a>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
  });
</script>

<style lang="scss" src="./style.scss"/>
