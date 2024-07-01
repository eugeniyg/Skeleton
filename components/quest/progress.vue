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
          v-for="width in props.columns"
          class="quest-progress__item"
          :style="`--column-width: ${width}%`"
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
</script>

<style src="~/assets/styles/components/quest/progress.scss" lang="scss"/>



