<template>
  <div
    ref="rootComponent"
    v-router-links
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

  const rootComponent = ref<HTMLElement | null>(null);
  onMounted(() => {
    const imageElements = rootComponent.value?.getElementsByTagName('img') || [];
    for (const imageElement of imageElements) {
      const dataAttr = imageElement.getAttribute('data-src');
      if (dataAttr) {
        imageElement.removeAttribute('data-src');
        imageElement.setAttribute('src', dataAttr);
      }
    }
  });
</script>

<style src="~/assets/styles/components/atomic/text-editor.scss" lang="scss" />
