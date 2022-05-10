<template>
  <div class="progress-bar">
    <div class="labels">
      <span class="label">1lvl</span>
      <span class="label">2lvl</span>
    </div>

    <div class="bar" :style="`--bar-percents: ${props.percents}`"></div>
    <div class="percents">{{ props.percents }}</div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    percents: {
      type: String,
      default: '50%',
    },
  });
</script>

<style lang="scss" src="./style.scss"/>
