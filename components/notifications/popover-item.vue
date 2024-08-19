<template>
  <div class="notifications-popover-item" :class="{'is-unread': unread }" ref="item">
    <div class="notifications-popover-item__header">
      <div class="notifications-popover-item__header-date">{{ props.item.date }}</div>
      <span
        v-if="props.item.unread"
        class="notifications-popover-item__header-badge"
      >
        New
      </span>
    </div>
    
    <div class="notifications-popover-item__title">{{ props.item.title }}</div>
    
    <div
      v-if="props.item.description"
      class="notifications-popover-item__description"
      :class="{
        'is-text-collapsed': isTextCollapsed,
        'is-collapse-btn-hidden': isTextButtonHidden,
      }"
    >
      <div
        class="notifications-popover-item__description-text"
        ref="textRef"
        v-html="marked.parse(props.item.description)"
      />
      
      <button-base type="ghost" @click="expandText">
        <span>Show all</span>
        <atomic-icon id="arrow_expand-close"></atomic-icon>
      </button-base>
      
    </div>
    
    <div
      v-if="props.item?.image"
      class="notifications-popover-item__img"
    >
      <atomic-image :src="props.item.image"/>
    </div>
    
    <div class="notifications-popover-item__footer">
      <atomic-divider/>
      
      <atomic-link :href="props.item.link.href" class="btn-ghost">
        <span>{{ props.item.link.label }}</span>
        <atomic-icon id="arrow_next"/>
      </atomic-link>
      
      <form-input-checkbox
        v-model:value="unread"
        name="notifications-toggle"
        label="Mark as read"
        icon="read-all"
      />
    
    </div>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';
  
  interface INotificationItem {
    title: string;
    image?: string;
    description: string;
    date: string;
    unread: number | string;
    link: {
      href: string;
      label: string;
    };
  }
  
  const props = defineProps<{
    item: INotificationItem;
    readAll: number | string;
  }>();
  
  const item = ref<HTMLElement>();
  const textRef = ref<HTMLElement>();
  
  const unread = ref<number | string>(props.readAll || props.item.unread);
  const isTextCollapsed = ref<boolean>(false);
  const isTextButtonHidden = ref<boolean>(false);
  
  const getItemHeight = () => {
    return parseInt(window.getComputedStyle(item.value).height);
  };
  
  const hasScroll = (element: HTMLElement) => {
    return element?.scrollHeight > element?.clientHeight;
  };
  
  const expandText = () => {
    isTextCollapsed.value = false;
    isTextButtonHidden.value = true;
  }
  
  defineExpose({ getItemHeight });
  
  watch(() => props.readAll, (newValue) => {
    unread.value = newValue;
  });
  
  onMounted(() => {
    if (hasScroll(textRef.value)) {
      isTextCollapsed.value = true
    }
  });
</script>
