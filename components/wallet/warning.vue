<template>
  <div class="wallet-warning" v-if="props.content?.description">
    <div class="wallet-warning__icon">
      <atomic-svg
        :src="props.content?.icon"
        defaultIcon="info"
      />
    </div>
    
    <div
      class="wallet-warning__description"
      v-html="marked.parse(props.content.description || '')"
    />
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  
  const props = defineProps<{
    content: {
      icon?: string;
      description: string;
    };
  }>();
</script>

<style src="~/assets/styles/components/wallet/warning.scss" lang="scss"/>
