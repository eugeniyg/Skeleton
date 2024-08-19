<template>
  <div class="notifications-accordion" :class="{ 'is-open': isOpen, 'is-unread': props.unread }">
    <div class="notifications-accordion__header">
      <button-base type="ghost" class="notifications-accordion__toggle" @click.stop="toggleOpen">
        <atomic-icon id="arrow-down-compact"/>
      </button-base>
      
      <div class="notifications-accordion__header-title">{{ props.title }}</div>
      <span class="notifications-accordion__header-badge" v-if="props.unread">New</span>
      <button-base type="ghost" class="notifications-accordion__remove">
        <atomic-icon id="trash"/>
      </button-base>
      
    </div>
    
    <div class="notifications-accordion__content" ref="contentContainer">
      <div v-if="props.date" class="notifications-accordion__date">
        {{ props.date }}
      </div>
      
      <div
        v-if="props.description"
        class="notifications-accordion__description"
        v-html="marked.parse(props.description)"
      />
      
      <div v-if="props.image" class="notifications-accordion__image">
        <atomic-image :src="props.image"/>
      </div>
      
      <atomic-link :href="props.link.href" class="btn-ghost notifications-accordion__link">
        <span>{{ props.link.label }}</span>
        <atomic-icon id="arrow_next"/>
      </atomic-link>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  
  const props = defineProps<{
    title: string;
    image: string;
    description: string;
    isOpen?: boolean;
    unread: boolean;
    date: string;
    link: {
      href: string;
      label: string;
    };
  }>();
  
  const isOpen = ref<boolean>(props.isOpen);
  const contentContainer = ref();
  
  const toggleOpen = (): void => {
    isOpen.value = !isOpen.value;
  };
</script>

<style src="~/assets/styles/components/notifications/accordion.scss" lang="scss" />
