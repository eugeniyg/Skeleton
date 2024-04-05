<template>
  <div v-if="props.items?.length" class="nav-static">
    <atomic-link
      v-for="(item, itemIndex) in props.items"
      :key="itemIndex"
      :href="item.url"
      :targetBlank="item?.targetBlank"
    >
      {{ item.label }}
    </atomic-link>
  </div>
</template>

<script setup lang="ts">
  import type { ILink } from "~/types";

  const props = defineProps<{
    items?: ILink[]
  }>();
</script>

<style src="~/assets/styles/components/nav/static.scss" lang="scss" />

