<template>
  <a class="card-benefit" href="#">
    <img class="icon" :src="`/svg${props.src}`" />
    <div class="title" v-html="props.title"></div>
  </a>
</template>

<script setup lang="ts">
  const props = defineProps({
    title: {
      type: String,
      default: 'Fast <br>withdrawals',
    },
    src: {
      type: String,
      default: '/icons-colored/fast-withdrawals.svg',
    },
  });
</script>

<style lang="scss" src="./style.scss"/>
