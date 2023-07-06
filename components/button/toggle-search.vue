<template>
  <button class="btn-toggle-search" @click="emit('toggle')" :class="{'is-active': props.isActive}">
    <atomic-icon id="search"/>
  </button>
</template>

<script setup lang="ts">
  const props = defineProps<{
    isActive: boolean
  }>()

  const emit = defineEmits(['toggle']);

</script>

<style src="~/assets/styles/components/button/toggle-search.scss" lang="scss" />
