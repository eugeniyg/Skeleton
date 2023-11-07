<template>
  <div class="list-socials">
    <a class="list-socials__item" v-for="item in props.items" :href="item.url">
      <atomic-icon :id="item.icon"/>
    </a>
  </div>
</template>

<script setup lang="ts">
  import type {ISiteSidebar} from '~/types';

  const props = defineProps<{
    items: ISiteSidebar['socials']['items']
  }>()
</script>

<style src="@skeleton/assets/styles/components/list/socials.scss" lang="scss" />
