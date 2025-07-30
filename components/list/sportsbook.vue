<template>
  <div class="list-sportsbook" :class="{ 'is-compact': props.isCompact }">
    <nuxt-link
      v-for="(item, index) in props.items"
      :key="index"
      class="item"
      :to="item.url.startsWith('http') ? item.url : localizePath(item.url)"
    >
      <atomic-icon :id="`sportsbook-${item.discipline}`" />
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
  import type { ISiteSidebar } from '~/types';

  const props = defineProps<{
    items: ISiteSidebar['topMenu']['items'][0]['sportsbookList'];
    isCompact?: boolean;
  }>();
</script>

<style src="~/assets/styles/components/list/sportsbook.scss" lang="scss" />
