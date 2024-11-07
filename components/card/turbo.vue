<template>
  <div class="card-turbo">
    <div class="content">
      <atomic-link class="thumb" :href="props.url">
        <atomic-picture :src="props.image" class="card-turbo__img" />
      </atomic-link>
      <div class="title">{{ props.title }}</div>

      <div class="sub-title">{{ props.categoryValue }}</div>

      <button-base type="primary" size="xs" :url="props.url">
        {{ props.buttonLabel }}
      </button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    buttonLabel: string;
    url: string;
    image: string;
    title: string;
    categoryValue: string;
  }>();
</script>

<style src="~/assets/styles/components/card/turbo.scss" lang="scss" />
