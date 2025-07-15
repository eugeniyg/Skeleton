<template>
  <div class="arrows">
    <button
      :key="'prev'"
      class="btn-prev"
      :disabled="props.prevDisabled"
      data-action="prev"
      @click="clickNavigation('prev')"
    >
      <atomic-icon id="arrow-expand-close" />
    </button>

    <button
      :key="'next'"
      class="btn-next"
      :disabled="props.nextDisabled"
      data-action="next"
      @click="clickNavigation('next')"
    >
      <atomic-icon id="arrow-expand-close" />
    </button>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    prevDisabled: {
      type: Boolean,
      default: true,
    },
    nextDisabled: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits(['clickAction']);
  const clickNavigation = (direction: string): void => {
    if ((direction === 'next' && props.nextDisabled) || (direction === 'prev' && props.prevDisabled)) return;
    emit('clickAction', direction);
  };
</script>

<style src="~/assets/styles/components/button/arrows.scss" lang="scss" />
