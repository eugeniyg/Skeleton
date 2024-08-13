<template>
  <div class="notifications-accordion" :class="{ 'is-open': isOpen }" @resize="updateScrollHeight">
    <div class="notifications-accordion__head" @click="toggleOpen">
      <atomic-icon id="arrow_expand-close" />
      <div class="notifications-accordion__title">{{ props.title }}</div>
      <span class="notifications-accordion__bage"></span>
      <atomic-icon id="trash" />
    </div>
    
    <div class="notifications-accordion__content" ref="contentContainer">
      {{ props.description }}
      {{ props.image }}
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    title: string;
    image: string;
    description: string;
    isNew?: boolean;
    isOpen?: boolean;
  }>();
  
  const isOpen = ref<boolean>(props.isOpen);
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
