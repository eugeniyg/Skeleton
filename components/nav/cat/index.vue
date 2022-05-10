<template>
  <div class="nav-cat-wrap">
    <div class="nav-cat">
      <a
        v-for="({ title, icon, href }, itemIndex) in props.items"
        :key="itemIndex"
        class="item"
        :href="href"
      >
        <atomic-icon :id="icon"/><span>{{ title }}</span>
      </a>
    </div>
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
