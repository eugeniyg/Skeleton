<template>
  <div class="expander">
    <div class="header" :class="{ 'is-open': open }" @click="toggle">
      <div class="title">{{ props.title }}</div>

      <button-base>
        <atomic-icon id="arrow-expand-open" />
      </button-base>
    </div>

    <div ref="contentElement" class="expander__content" :style="styles">
      <atomic-text-editor :content="props.content" />
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    title?: string;
    content?: string;
    isOpen?: boolean;
  }>();

  const open = ref<boolean>(props.isOpen);
  const maxHeight = ref<number>(0);

  const styles = computed(() => ({ '--max-height': open.value ? `${maxHeight.value}px` : '0px' }));
  const contentElement = ref<HTMLElement>();

  const toggle = (): void => {
    open.value = !open.value;
    maxHeight.value = open.value ? contentElement.value?.scrollHeight || 0 : 0;
  };

  onMounted(() => {
    maxHeight.value = contentElement.value?.scrollHeight || 0;
  });
</script>

<style src="~/assets/styles/components/expander.scss" lang="scss" />
