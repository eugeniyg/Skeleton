<template>
  <div class="detail" :class="{ 'is-open': open }" @resize="updateScrollHeight">
    <div class="header" @click="toggleOpen">
      <div class="title">{{ props.title }}</div>
      <atomic-icon id="arrow_expand-close" />
    </div>

    <div class="detail-content" ref="refItems">
      <atomic-text-editor class="description" :content="props.content" />
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  });

  const open = ref<boolean>(props.isOpen);
  const scrollHeight = ref<number>(0);
  const refItems = ref();

  const toggleOpen = (): void => {
    open.value = !open.value;
    const height = open.value ? scrollHeight.value : 0;
    refItems.value.style.setProperty('--items-height', `${height}px`);
  };

  const updateScrollHeight = (): void => {
    scrollHeight.value = refItems.value.scrollHeight;
  };
  onMounted(() => {
    setTimeout(() => {
      updateScrollHeight();
    }, 100);
  });
</script>

<style lang="scss" src="./style.scss"/>
