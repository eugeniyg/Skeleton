<template>
  <div class="list-socials">
    <atomic-link
      v-for="(item, index) in props.items"
      :key="index"
      class="list-socials__item"
      :href="item.url"
      :targetBlank="item?.targetBlank"
    >
      <atomic-icon :id="item.icon"/>
    </atomic-link>
    
  </div>
</template>

<script setup lang="ts">
  import type { ISiteSidebar } from '~/types';

  const props = defineProps<{
    items: ISiteSidebar['socials']['items']
  }>()
</script>

<style src="@skeleton/assets/styles/components/list/socials.scss" lang="scss" />
