<template>
  <div class="loyalty-progress">
    <span class="loyalty-progress__line" :style="{width: `${currentLevelProgress}%`}"/>
  </div>
</template>

<script setup lang="ts">
  const loyaltyStore = useLoyaltyStore();
  const { currentLevelProgress } = storeToRefs(loyaltyStore);
</script>

<style src="~/assets/styles/components/loyalty/progress.scss" lang="scss"/>