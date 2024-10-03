<template>
  <div class="titles">
    <slot>
      <div v-if="props.title" class="title">{{ props.title }}</div>
      <div v-if="props.subTitle" class="sub-title">{{ props.subTitle }}</div>
    </slot>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{title?: string, subTitle?: string}>();
</script>

<style src="~/assets/styles/components/atomic/titles.scss" lang="scss" />
