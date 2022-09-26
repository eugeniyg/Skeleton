<template>
  <button class="btn-verify" @click="$emit('verify')" v-show="props.isShown">
    <slot></slot>
  </button>
</template>

<script setup type="ts">
  const props = defineProps({
    isShown: {
      type: Boolean,
      default: false,
    },
  });
</script>

<style lang="scss" src="./style.scss"></style>
