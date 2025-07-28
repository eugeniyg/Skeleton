<template>
  <div class="text-wrap">
    <div
      v-if="props.visible"
      v-router-links
      class="text-wrap__visible"
      v-html="DOMPurify.sanitize(marked.parse(props.visible || '') as string, { FORBID_TAGS: ['style'] })"
    />

    <div
      v-if="props.hidden"
      v-show="showHidden"
      v-router-links
      class="text-wrap__hidden"
      v-html="DOMPurify.sanitize(marked.parse(props.hidden || '') as string, { FORBID_TAGS: ['style'] })"
    />

    <button-show-more v-if="showButton" @click="showHidden = true">
      {{ props.button }}
    </button-show-more>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import DOMPurify from 'isomorphic-dompurify';

  const props = defineProps<{
    visible?: string;
    hidden?: string;
    button?: string;
  }>();

  const showHidden = ref<boolean>(false);
  const showButton = computed(() => props.button && props.hidden && !showHidden.value);
</script>

<style src="~/assets/styles/components/atomic/seo-text.scss" lang="scss" />
