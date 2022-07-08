<template>
  <div class="nav-static">
    <nuxt-link v-for="(item, itemIndex) in props.items" :key="itemIndex" :to="localizePath(item.href)">{{ item.title }}</nuxt-link>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
  });

  const { localizePath } = useProjectMethods();
</script>

<style lang="scss" src="./style.scss"/>
