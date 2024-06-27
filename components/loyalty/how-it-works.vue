<template>
  <div class="loyalty-how-it-works">
    <div class="loyalty-how-it-works__title" v-html="marked.parse(props.content.title)"/>
    <div class="loyalty-how-it-works__description" v-html="marked.parse(props.content.description)"/>
    
    <div class="loyalty-how-it-works__container">
      <atomic-image :src="props.content.image" class="loyalty-how-it-works__image"/>
      
      <ul v-if="props.content?.list" class="loyalty-how-it-works__list" :class="{'is-numeric': props.content.list.isNumeric}">
        <li v-for="item in props.content.list?.items" class="loyalty-how-it-works__list-item">
          <div class="loyalty-how-it-works__list-item-title">{{ item.title }}</div>
          <div class="loyalty-how-it-works__list-item-description">{{ item.description }}</div>
        </li>
      </ul>
    </div>
  
  </div>
</template>

<script setup lang="ts">
  import type { ILoyaltyPage } from '~/types';
  
  const props = defineProps<{
    content: ILoyaltyPage['howItWorks'];
  }>();
  
  import { marked } from 'marked';
</script>

<style src="~/assets/styles/components/loyalty/how-it-works.scss" lang="scss"/>
