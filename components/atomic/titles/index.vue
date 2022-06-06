<template>
  <div class="titles">
    <slot>
      <div class="title" v-if="props.title">{{ props.title }}</div>
      <div class="sub-title" v-if="props.subTitle">{{ props.subTitle }}</div>
    </slot>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    title: {
      type: String,
      required: false,
    },
    subTitle: {
      type: String,
      required: false,
    },
  });
</script>

<style lang="scss" src="./style.scss"/>
