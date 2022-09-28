<template>
  <span class="btn-verify" v-show="props.isShown">
    <slot />
  </span>
</template>

<script setup lang="ts">
  const props = defineProps({
    isShown: {
      type: Boolean,
      default: false,
    },
  });
</script>

<style lang="scss" src="./style.scss" />
