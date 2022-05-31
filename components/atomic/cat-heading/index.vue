<template>
  <div class="cat-heading">
    <atomic-icon :id="props.icon"/>
    <slot/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    icon: {
      type: String,
      required: true,
    },
  });
</script>

<style lang="scss" src="./style.scss"/>
