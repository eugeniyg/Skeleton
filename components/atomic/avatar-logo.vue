<template>
  <div class="avatar-logo">
    <atomic-image :src="props.userImg" class="avatar-logo__user-img" />
    <atomic-image v-if="props.levelImg" :src="props.levelImg" class="avatar-logo__level-img"/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    userImg: string;
    levelImg?: string;
  }>()
</script>

<style src="~/assets/styles/components/atomic/avatar-logo.scss" lang="scss"/>
