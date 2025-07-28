<template>
  <div class="terms-expander">
    <div class="terms-expander__header" :class="{ 'is-open': isOpen }" @click="toggle">
      <div class="terms-expander__title">{{ props.title }}</div>

      <button-base type="ghost" class="terms-expander__toggle" @click.stop="toggle">
        <atomic-icon id="arrow-expand-open" />
      </button-base>
    </div>

    <div ref="contentElement" class="terms-expander__content" :style="styles">
      <atomic-text-editor :content="props.content" />
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    title: string;
    content: string;
  }>();

  const isOpen = ref<boolean>(false);
  const maxHeight = ref<number>(0);

  const styles = computed(() => ({ '--max-height': isOpen.value ? `${maxHeight.value}px` : '0px' }));
  const contentElement = ref<HTMLElement>();

  const toggle = (): void => {
    isOpen.value = !isOpen.value;
    maxHeight.value = isOpen.value ? contentElement.value?.scrollHeight || 0 : 0;
  };

  onMounted(() => {
    maxHeight.value = contentElement.value?.scrollHeight || 0;
  });
</script>

<style src="~/assets/styles/components/terms-expander.scss" lang="scss" />
