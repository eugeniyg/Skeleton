<template>
  <div
    class="text-editor"
    v-html="DOMPurify.sanitize(marked.parse(props.content || '') as string, { FORBID_TAGS: ['style'] })"
  />
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import DOMPurify from 'isomorphic-dompurify';

  const props = defineProps<{
    content: Maybe<string>;
  }>();
</script>

<style src="~/assets/styles/components/atomic/text-editor.scss" lang="scss" />
