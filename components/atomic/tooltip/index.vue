<template>
  <div class="tooltip">
    <atomic-icon :id="props.icon"/>

    <div class="message">
      <div class="title" v-if="props.title">{{ props.title }}</div>
      <div class="text" v-if="props.text">{{ props.text }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    icon: {
      type: String,
      default: 'ui-info',
    },
    title: {
      type: String,
    },
    text: {
      type: String,
    },
  });
</script>

<style lang="scss" src="./style.scss"/>
