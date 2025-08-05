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
            <div class="lottery-prizes__list-item-title">
              {{ item.title }}
            </div>
            
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
  
  const lotteryContent = ref<Maybe<ILotteryPage>>(inject('lotteryContent'));
  const defaultLocaleLotteryContent = ref<Maybe<ILotteryPage>>(inject('defaultLocaleLotteryContent'));
  
  const title = computed(() => getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'prizes.title'));
  
  const description = computed(() => {
    const contentText = getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'prizes.description');
    if (!contentText) return '';
    return DOMPurify.sanitize(marked.parseInline(contentText) as string, { FORBID_TAGS: ['style'] });
  });
  
  const image = computed(() => getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'prizes.image'));
  
  const listItems = computed(() => {
    return getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'prizes.items') || [];
  });
  
  const formatItemDescription = (description: string, addLink: boolean) => {
    if (!description) return '';
    let textContent = description;
    if (addLink) {
      const linkText = getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'prizes.lastItemLinkText');
      const linkHtml = `<span class="lottery-prizes__custom-link">${linkText}</span>`;
      textContent = description + ' ' + linkHtml;
    }
    return DOMPurify.sanitize(marked.parseInline(textContent) as string, { FORBID_TAGS: ['style'] });
  };
  
  const prizesRoot = useTemplateRef<HTMLElement | null>('prizes-root');
  
  const lastPrizeLinkClickHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('lottery-prizes__custom-link')) {
      e.preventDefault();
      openModal('lottery-prizes');
    }
  };
  
  onMounted(() => {
    prizesRoot.value?.addEventListener('click', lastPrizeLinkClickHandler);
  });
  
  onUnmounted(() => {
    prizesRoot.value?.removeEventListener('click', lastPrizeLinkClickHandler);
  });
</script>

<style src="~/assets/styles/components/lottery/prizes.scss" lang="scss"/>