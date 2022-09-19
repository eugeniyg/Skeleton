<template>
  <div class="progress-bar">
    <div class="labels">
      <span class="label">1{{ sidebarContent?.profileMenu?.levelLabel}}</span>
      <span class="label">2{{ sidebarContent?.profileMenu?.levelLabel}}</span>
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
  const { sidebarContent } = useGlobalStore();
</script>

<style lang="scss" src="./style.scss"/>
