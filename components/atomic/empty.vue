<template>
  <div class="empty" :class="currentClass">
    <atomic-image
      class="empty__image"
      v-if="props.image"
      :src="props.image"
    />
    <atomic-icon-colored v-else-if="currentIcon" :id="currentIcon"/>
    <div class="title">{{ props.title }}</div>
    <div class="sub-title" v-html="marked.parse(props.subTitle)"/>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';

  const props = defineProps({
    variant: {
      type: String,
      validator: (val:string) => [
        'transactions',
        'notification',
        'bonuses',
        'bets-history',
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
