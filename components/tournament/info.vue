<template>
  <client-only>
  <div class="tournament-info">
    <div class="tournament-info__title">{{ props.content.title }}</div>
    
    <div class="tournament-info__items">
      <div class="tournament-info__item">
        <atomic-image :src="props.content.prizes.image" />
        <span class="tournament-info__item-label">{{ content.prizes.label }}</span>
        <span class="tournament-info__item-count">{{ content.prizes.count }}</span>
      </div>
      
      <div class="tournament-info__item">
        <atomic-image :src="content.games.image"/>
        <span class="tournament-info__item-label">{{ content.games.label }}</span>
        <span class="tournament-info__item-count">{{ content.games.count }}</span>
      </div>
    </div>
    
    <div
      ref="descriptionRef"
      class="tournament-info__description"
      v-html="DOMPurify.sanitize(marked.parse(content.description || '') as string, { FORBID_TAGS: ['style'] })"
      :class="{'is-expanded': isExpanded}"
    />
    
    <button-base
      v-if="displayMoreBtn"
      class="tournament-info__more-btn"
      type="ghost"
      @click="expandDescription"
    >
      <span>{{ content.moreButtonLabel }}</span>
      <atomic-icon id="arrow_expand-close"/>
    </button-base>
    
  </div>
  </client-only>
</template>

<script setup lang="ts">
  import type { ITournamentPage } from '~/types';
  import DOMPurify from 'isomorphic-dompurify';
  import { marked } from 'marked';
  
  const props = defineProps<{
    content: ITournamentPage['info'];
  }>();
  
  const descriptionRef = ref();
  const displayMoreBtn = ref(false);
  const isExpanded = ref(false);
  
  const checkDisplayMoreBtn = () => {
    if (descriptionRef.value) {
      displayMoreBtn.value = descriptionRef.value?.scrollHeight > descriptionRef.value?.offsetHeight;
    }
  };
  
  const expandDescription = () => {
    isExpanded.value = true;
    displayMoreBtn.value = false;
  };
  
  onMounted(() => {
    window.addEventListener('resize', checkDisplayMoreBtn);
    nextTick(() => checkDisplayMoreBtn())
  });
  
  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkDisplayMoreBtn);
  });
</script>

<style src="~/assets/styles/components/tournament/info.scss" lang="scss" />
