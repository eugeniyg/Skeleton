<template>
  <div class="quest-tasks-header">
    {{ props.title }}
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    title: string
  }>()
</script>

<style src="~/assets/styles/components/quest/tasks-header.scss" lang="scss"/>
