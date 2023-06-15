<template>
  <div class="progress-bar">
    <div class="labels">
      <span class="label">1{{ getContent(sidebarContent, defaultLocaleSidebarContent, 'profileMenu.levelLabel') }}</span>
      <span class="label">2{{ getContent(sidebarContent, defaultLocaleSidebarContent, 'profileMenu.levelLabel') }}</span>
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
  const { sidebarContent, defaultLocaleSidebarContent } = useGlobalStore();
  const { getContent } = useProjectMethods();
</script>

<style src="~/assets/styles/components/profile/progress-bar.scss" lang="scss" />

