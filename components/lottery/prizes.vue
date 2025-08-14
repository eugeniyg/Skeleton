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
          <atomic-picture else class="lottery-prizes__list-item-icon" :src="item.image" />
          
          <div class="lottery-prizes__list-item-content">
            <div class="lottery-prizes__list-item-title">{{ item.title }}</div>
            
            <div
              class="lottery-prizes__list-item-description"
              v-html="formatItemDescription(item.description, index === listItems.length - 1)"
            />
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
  
  const formatItemDescription = (description: string, addLink: boolean) => {
    if (!description) return '';
    if (addLink) {
      const linkText = getContent(lotteryPageContent.value, lotteryPageDefaultContent.value, 'prizes.lastItemLinkText');
      description += ` <span class="lottery-prizes__custom-link">${linkText}</span>`;
    }
    return DOMPurify.sanitize(marked.parseInline(description) as string, { FORBID_TAGS: ['style'] });
  };
  
  const prizesRoot = useTemplateRef<HTMLElement | null>('prizes-root');
  
  const lastPrizeLinkClickHandler = (e: MouseEvent) => {
    const el = e.target as HTMLElement;
    if (!el.classList?.contains('lottery-prizes__custom-link')) return;
    e.preventDefault();
    openModal('lottery-reward');
  };
  
  onMounted(() => {
    prizesRoot.value?.addEventListener('click', lastPrizeLinkClickHandler);
  });
  
  onUnmounted(() => {
    prizesRoot.value?.removeEventListener('click', lastPrizeLinkClickHandler);
  });
</script>

<style src="~/assets/styles/components/lottery/prizes.scss" lang="scss"/>