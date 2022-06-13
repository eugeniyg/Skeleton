<template>
  <div class="qr">
    <div class="title">{{ props.title }}</div>
    <div class="description">{{ props.description }}</div>
    <div class="box">
      <img src="~/assets/img/qr.png" width="100" height="100" />
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    title: {
      type: String,
      default: 'Address',
    },
    description: {
      type: String,
      default: 'This is your personal address for deposits. Your funds will be available as soon as they pass through the necessary confirmations.',
    },
  });
</script>

<style lang="scss" src="./style.scss"/>
