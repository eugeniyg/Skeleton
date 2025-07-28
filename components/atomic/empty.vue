<template>
  <div class="empty" :class="currentClass">
    <atomic-image v-if="props.image" class="empty__image" :src="props.image" />
    <atomic-icon v-else-if="currentIcon" :id="currentIcon" filled />
    <div class="title">{{ props.title }}</div>
    <div
      class="sub-title"
      v-html="DOMPurify.sanitize(marked.parse(props.subTitle || '') as string, { FORBID_TAGS: ['style'] })"
    />
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import DOMPurify from 'isomorphic-dompurify';

  const props = defineProps<{
    variant?: 'transactions' | 'notification' | 'bonuses' | 'bets-history' | 'search';
    image?: string;
    title?: string;
    subTitle?: string;
  }>();

  const currentClass = computed(() => (props.variant ? `variant-${props.variant}` : undefined));
  const currentIcon = computed(() => (props.variant ? `empty-${props.variant}` : undefined));
</script>

<style src="~/assets/styles/components/atomic/empty.scss" lang="scss" />
