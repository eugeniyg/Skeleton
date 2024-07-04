<template>
  <div class="loyalty-faq">
    <div class="loyalty-faq__title" v-html="marked.parse(props.content.title)"/>
    <div class="loyalty-faq__description" v-html="marked.parse(props.content.description)"/>
    
    <div v-if="content?.items?.length" class="loyalty-faq__items">
      <div v-if="firstHalf" class="loyalty-faq__column">
        <expander
          v-for="(item, itemIndex) in firstHalf"
          :key="itemIndex"
          :title="item.question"
          :content="item.answer"
        />
      </div>
      <div v-if="secondHalf" class="loyalty-faq__column">
        <expander
          v-for="(item, itemIndex) in secondHalf"
          :key="itemIndex"
          :title="item.question"
          :content="item.answer"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import type { ILoyaltyPage } from '~/types';
  
  const props = defineProps<{
    content: ILoyaltyPage['faq'];
  }>();
  
  const firstHalf = ref<ILoyaltyPage['faq']['items']>([]);
  const secondHalf = ref<ILoyaltyPage['faq']['items']>([]);
  
  if (props.content?.items?.length) {
    const middleIndex = Math.floor(props.content?.items?.length / 2);
    firstHalf.value = props.content?.items?.slice(0, middleIndex);
    secondHalf.value = props.content?.items?.slice(middleIndex);
  }
</script>

<style src="~/assets/styles/components/loyalty/faq.scss" lang="scss"/>
