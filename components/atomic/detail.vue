<template>
  <div class="detail" :class="{ 'is-open': open }" @resize="updateScrollHeight">
    <div class="header" @click="toggleOpen">
      <div class="title">{{ props.title }}</div>
      <atomic-icon id="arrow-expand-close" />
    </div>

    <div ref="refItems" class="detail-content">
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

  const updateScrollHeight = async (): Promise<void> => {
    await nextTick();
    scrollHeight.value = refItems.value.scrollHeight;
  };

  onMounted(() => {
    updateScrollHeight();
  });
</script>

<style src="~/assets/styles/components/atomic/detail.scss" lang="scss" />
