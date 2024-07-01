<template>
  <div class="loyalty-rewards">
    <div class="loyalty-rewards__title" v-html="marked.parse(props.content.title)"/>
    <div class="loyalty-rewards__description" v-html="marked.parse(props.content.description)"/>
    
    <client-only>
      <loyalty-rewards-slider/>
    </client-only>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import type { ILoyaltyPage } from '~/types';
  
  const props = defineProps<{
    content: ILoyaltyPage['rewards'];
  }>();
</script>

<style src="~/assets/styles/components/loyalty/rewards.scss" lang="scss"/>
