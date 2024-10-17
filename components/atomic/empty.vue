<template>
  <div class="empty" :class="currentClass">
    <atomic-image
      v-if="props.image"
      class="empty__image"
      :src="props.image"
    />
    <atomic-icon-colored v-else-if="currentIcon" :id="currentIcon"/>
    <div class="title">{{ props.title }}</div>
    <div class="sub-title" v-html="DOMPurify.sanitize(marked.parse(props.subTitle || '') as string, { FORBID_TAGS: ['style'] }) "/>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import DOMPurify from "isomorphic-dompurify";

  const props = defineProps({
    variant: {
      type: String,
      validator: (val:string) => [
        'transactions',
        'notification',
        'bonuses',
        'bets-history',
        'search'
      ].includes(val),
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      default: '',
    },
    subTitle: {
      type: String,
      default: '',
    },
  });

  const currentClass = computed(() => (props.variant ? `variant-${props.variant}` : undefined));
  const currentIcon = computed(() => (props.variant ? `empty-${props.variant}` : undefined));
</script>

<style src="~/assets/styles/components/atomic/empty.scss" lang="scss" />
