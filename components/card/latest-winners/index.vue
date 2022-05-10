<template>
  <div class="card-latest-winners">
    <div class="img" :style="backgroundImage"></div>
    <div class="title">{{ props.title }}</div>
    <div class="sub-title">{{ props.subTitle }}</div>
    <div class="items">
      <span v-for="(item, itemIndex) in props.items" :key="itemIndex" class="item">{{ item }}</span>
    </div>
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
      default: '',
    },
    subTitle: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: () => [],
    },
  });

  const backgroundImage = computed(() => `background-image:url(/img${props.src})`);
</script>

<style lang="scss" src="./style.scss"/>
