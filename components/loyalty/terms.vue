<template>
  <div class="loyalty-terms">
    <div class="loyalty-terms__header" :class="{'is-open': isOpen}" @click="toggle">
      <div class="loyalty-terms__title">{{ props.title }}</div>

      <button-base type="ghost" class="loyalty-terms__toggle" @click.stop="toggle">
        <atomic-icon id="arrow_expand-open"/>
      </button-base>
    </div>

    <div ref="content" class="loyalty-terms__content" :style="styles">
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
  const content = ref<HTMLElement>();

  const toggle = ():void => {
    isOpen.value = !isOpen.value;
    maxHeight.value = isOpen.value ? content.value?.scrollHeight || 0 : 0;
  };

  onMounted(() => {
    maxHeight.value = content.value?.scrollHeight || 0;
  });
</script>

<style src="~/assets/styles/components/loyalty/terms.scss" lang="scss" />