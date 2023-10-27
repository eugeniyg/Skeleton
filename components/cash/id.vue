<template>
  <div class="cash-id">
    <span>{{ props.label }}</span>
    <span>{{ props.id }}</span>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    label: string,
    id: number
  }>()
</script>

<style src="~/assets/styles/components/cash/id.scss" lang="scss" />