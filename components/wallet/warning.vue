<template>
  <div v-if="props.content?.description" class="wallet-warning">
    <div class="wallet-warning__icon">
      <atomic-svg
        :src="props.content?.icon"
        defaultIcon="info"
      />
    </div>
    
    <div
      class="wallet-warning__description"
      v-html="DOMPurify.sanitize(marked.parseInline(props.content.description || '') as string, { FORBID_TAGS: ['style'] })"
    />
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import DOMPurify from "isomorphic-dompurify";

  const props = defineProps<{
    content: {
      icon?: string;
      description: string;
    };
  }>();
</script>

<style src="~/assets/styles/components/wallet/warning.scss" lang="scss"/>
