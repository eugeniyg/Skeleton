<template>
  <button class="btn-toggle-filter" @click="emit('toggle')" :class="{'is-active': props.isActive}">
    <atomic-icon id="filter"/>
  </button>
</template>

<script setup lang="ts">
  const props = defineProps<{
    isActive: boolean
  }>()

  const emit = defineEmits(['toggle']);
</script>

<style src="~/assets/styles/components/button/toggle-filter.scss" lang="scss" />
