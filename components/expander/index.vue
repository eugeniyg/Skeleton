<template>
  <div class="expander">
    <expander-item
      v-for="({ title, content, isOpen }, itemIndex) in props.items"
      :key="itemIndex"
      :title="title"
      :content="content"
      :is-open="isOpen"
    />
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
