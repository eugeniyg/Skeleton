<template>
  <div class="bonus">
    <img class="img" :src="props.src" />
    <div class="title">{{ props.title }}</div>
    <div class="sub-title">{{ props.subTitle }}</div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    title: {
      type: String,
      default: 'Get your welcome bonuses:',
    },
    subTitle: {
      type: String,
      default: '5 BTC + 300 FS',
    },
    src: {
      type: String,
      default: '/svg/colored/icn-notification.svg',
    },
  });
</script>

<style lang="scss" src="./style.scss"/>
