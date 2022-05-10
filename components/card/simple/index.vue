<template>
  <div class="card">
    <div class="img" :style="backgroundImage"/>
    <div class="title">{{ props.title }}</div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    src: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  });
  const backgroundImage = computed(() => `background-image:url(/img${props.src})`);
</script>

<style lang="scss" src="./style.scss"/>
