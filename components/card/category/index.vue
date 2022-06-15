<template>
  <div class="card-category">
    <div class="cover"/>

    <div class="title">
      <atomic-icon :id="props.title.icon"/>{{ props.title.text }}
    </div>

    <div class="sub-title">{{ props.subTitle }}</div>

    <button-base
      type="primary"
      size="md"
      :url="props.action.href"
    >
      {{ props.action.title }}
    </button-base>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    title: {
      type: Object,
      default: () => ({
        icon: 'cherry',
        text: 'text',
      }),
    },
    subTitle: {
      type: String,
      default: 'sub title',
    },
    action: {
      type: Object,
      default: () => ({
        title: 'Go to',
        href: '#',
      }),
    },
  });
</script>

<style lang="scss" src="./style.scss"/>
