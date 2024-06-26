<template>
  <div class="quest-progress">
    <div class="quest-progress__container">
      <div
        v-if="props?.label"
        class="quest-progress__label"
      >
        {{ props.label }}
      </div>
      <div class="quest-progress__line" :style="{ width: styleProgress }"/>
      <div class="quest-progress__items">
        <div
          v-for="(item, index) in props.columns"
          class="quest-progress__item"
        >
          <atomic-icon id="exclude-mask" v-if="index < columns - 1"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    width: number,
    columns: number,
    label?: string,
  }>();
  
  const styleProgress = computed(() => {
    return `${props.width || 0}%`;
  });
</script>

<style src="~/assets/styles/components/quest/progress.scss" lang="scss"/>



