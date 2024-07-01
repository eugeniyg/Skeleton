<template>
  <div class="quest-progress">
    <div class="quest-progress__container">
      <div
        v-if="props?.label"
        class="quest-progress__label"
      >
        {{ props.label }}
      </div>

      <div class="quest-progress__items">
        <div
          v-for="column in props.columns"
          class="quest-progress__item"
          :style="styleGradient(column)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    columns: number[],
    label?: string,
  }>();
  
  const styleGradient = (percentage: number) => {
    return `background-image: linear-gradient(113deg, var(--support-brand-default) ${percentage}%, transparent ${percentage}%)`
  };
</script>

<style src="~/assets/styles/components/quest/progress.scss" lang="scss"/>



