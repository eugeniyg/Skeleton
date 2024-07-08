<template>
  <div class="loyalty-progress">
    <span class="loyalty-progress__line" :style="{width: `${percentage}%`}"/>
    <!--<span class="loyalty-progress__percentage">{{ `${percentage}%` }}</span>--->
  </div>
</template>

<script setup lang="ts">
  const percentage = '50';
</script>

<style src="~/assets/styles/components/loyalty/progress.scss" lang="scss"/>
