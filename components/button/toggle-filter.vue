<template>
  <button class="btn-toggle-filter" :class="{'is-active': props.isActive}" @click="emit('toggle')">
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
