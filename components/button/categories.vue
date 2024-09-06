<template>
  <div class="btn-categories" @click="emit('action')" :class="{'is-active': props.isActive}">
    <atomic-icon id="more-menu" class="btn-categories__icon"/>
    <span class="btn-categories__label">Categories</span>
    <atomic-icon id="dropdown-arrows" class="btn-categories__icon"/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    isActive?: boolean;
  }>()
  const emit = defineEmits(['action']);
</script>

<style src="~/assets/styles/components/button/categories.scss" lang="scss" />
