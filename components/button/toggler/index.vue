<template>
  <div class="toggler-btn" :class="{'is-compact' : props.isCompact}">
    <button-base
      v-for="(button, index) in props.items"
      :key="index"
      :isActive="button.isActive"
    >
      <atomic-icon :id="button.icon"/>
      <span class="text">{{ button.title }}</span>
    </button-base>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
    isCompact: {
      type: Boolean,
      default: false,
    },
  });
</script>

<style lang="scss" src="./style.scss"/>
