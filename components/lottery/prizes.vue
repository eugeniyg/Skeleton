<template>
  <div class="lottery-prizes">
    <div class="lottery-prizes__title">{{ title }}</div>
    <div class="lottery-prizes__description" v-if="description" v-html="description"/>
    
    <div class="lottery-prizes__container">
      <atomic-picture
        v-if="image"
        :src="image"
        class="lottery-prizes__picture"
      />
      
      <ul v-if="listItems.length" class="lottery-prizes__list" ref="prizes-root">
        <li
          v-for="(item, index) in listItems"
          :key="index"
          class="lottery-prizes__list-item"
          :class="{ 'is-numeric': !item.image }"
        >
          <div v-if="!item.image" class="lottery-prizes__list-item-icon">
            {{ index + 1 }}
          </div>
          <atomic-picture v-else class="lottery-prizes__list-item-icon" :src="item.image" />
          
          <div class="lottery-prizes__list-item-content">
            <div class="lottery-prizes__list-item-title">{{ item.title }}</div>
            
            <div class="lottery-prizes__list-item-description">
              {{ item.description }}
              <span
                v-if="index === listItems.length - 1"
                class="lottery-prizes__custom-link"
                @click="openModal('lottery-reward', { props: { lotteryIdentity }})"
              >
                {{ linkText }}
              </span>
            </div>
          
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ILotteryPage } from "~/types";
  import { getContent } from "#imports";
  import DOMPurify from "isomorphic-dompurify";
  import { marked } from "marked";
  const { openModal } = useModalStore();
  
  const route = useRoute();
  const lotteryIdentity = route.params.lotteryIdentity as string;
  
  const lotteryPageContent = ref<Maybe<ILotteryPage>>(inject('lotteryPageContent'));
  const lotteryPageDefaultContent = ref<Maybe<ILotteryPage>>(inject('lotteryPageDefaultContent'));
  
  const title = computed(() => getContent(lotteryPageContent.value, lotteryPageDefaultContent.value, 'prizes.title')) || '';
  
  const description = computed(() => {
    const contentText = getContent(lotteryPageContent.value, lotteryPageDefaultContent.value, 'prizes.description');
    return DOMPurify.sanitize(marked.parseInline(contentText || '') as string, { FORBID_TAGS: ['style'] });
  });
  
  const image = computed(() => getContent(lotteryPageContent.value, lotteryPageDefaultContent.value, 'prizes.image'));
  
  const listItems = computed(() => {
    return getContent(lotteryPageContent.value, lotteryPageDefaultContent.value, 'prizes.items') || [];
  });
  
  const linkText = computed(() => getContent(lotteryPageContent.value, lotteryPageDefaultContent.value, 'prizes.lastItemLinkText') || '');
</script>

<style src="~/assets/styles/components/lottery/prizes.scss" lang="scss"/>