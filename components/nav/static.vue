<template>
  <div v-if="props.items?.length" class="nav-static">
    <nuxt-link
      v-for="(item, itemIndex) in props.items"
      :key="itemIndex"
      :to="localizePath(item.url)"
    >
      {{ item.label }}
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
  import type { ILink } from "~/types";

  const props = defineProps<{
    items?: ILink[]
  }>();

  const { localizePath } = useProjectMethods();
</script>

<style src="~/assets/styles/components/nav/static.scss" lang="scss" />

