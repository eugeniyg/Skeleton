<template>
  <div class="loyalty-terms" v-if="props.content">
    <div class="loyalty-terms__header">
      <div class="loyalty-terms__title">{{ props.content?.title }}</div>
    </div>
    
    <div v-html="marked.parse(props.content?.content)"/>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  
  const props = defineProps<{
    content: string;
  }>();
  
  const isExpanded = ref<boolean>(false);
</script>

<style src="~/assets/styles/components/loyalty/terms.scss" lang="scss" />

