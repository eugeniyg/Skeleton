<template>
  <div class="text-editor" v-html="marked.parse(props.content || '')" />
</template>

<script setup lang="ts">
  import { marked } from 'marked';

  const props = defineProps<{content?: string}>();
</script>

<style src="~/assets/styles/components/atomic/text-editor.scss" lang="scss" />
