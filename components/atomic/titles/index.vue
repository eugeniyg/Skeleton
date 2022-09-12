<template>
  <div class="titles">
    <slot>
      <div class="title" v-if="props.title">{{ props.title }}</div>
      <div class="sub-title" v-if="props.subTitle">{{ props.subTitle }}</div>
    </slot>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{title?: string, subTitle?: string}>();
</script>

<style lang="scss" src="./style.scss"/>
