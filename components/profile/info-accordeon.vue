<template>
  <div class="info-accordeon" :class="{ 'is-open': isOpen }" @resize="updateScrollHeight">
    <div class="info-accordeon__head" @click="toggleOpen">
      <div class="info-accordeon__title">{{ props.title }}</div>
      <atomic-icon id="arrow_expand-close" />
    </div>

    <div
      ref="contentContainer"
      class="info-accordeon__content"
      v-router-links
      v-html="DOMPurify.sanitize(marked.parseInline(props.description || '') as string, { FORBID_TAGS: ['style'] })"
    />
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  import DOMPurify from 'isomorphic-dompurify';

  const props = defineProps<{
    title: string;
    description: string;
  }>();

  const isOpen = ref<boolean>(false);
  const scrollHeight = ref<number>(0);
  const contentContainer = ref();

  const toggleOpen = (): void => {
    isOpen.value = !isOpen.value;
    const height = isOpen.value ? scrollHeight.value : 0;
    contentContainer.value.style.setProperty('--items-height', `${height}px`);
  };

  const updateScrollHeight = (): void => {
    scrollHeight.value = contentContainer.value.scrollHeight;
  };

  onMounted(() => {
    updateScrollHeight();
  });
</script>
