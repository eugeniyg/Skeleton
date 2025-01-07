<template>
  <div v-if="props.content?.description" class="wallet-destination-tag-warning">
    <div class="wallet-destination-tag-warning__icon">
      <atomic-svg :src="props.content?.icon" default-icon="info" />
    </div>

    <div
      class="wallet-destination-tag-warning__description"
      v-html="
        DOMPurify.sanitize(marked.parseInline(props.content.description || '') as string, { FORBID_TAGS: ['style'] })
      "
    />
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import DOMPurify from 'isomorphic-dompurify';

  const props = defineProps<{
    content: {
      icon?: string;
      description: string;
    };
  }>();
</script>

<style src="~/assets/styles/components/wallet/destination-tag-warning.scss" lang="scss" />
