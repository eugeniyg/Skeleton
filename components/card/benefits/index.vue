<template>
  <div class="card-benefits">
    <atomic-icon :id="props.icon"/>
    <h2 class="title">{{ props.label }}</h2>

    <div class="card-benefits__list">
      <div
        class="card-benefits__item"
        v-for="(benefit, index) in props.items"
        :key="index"
      >
        <img class="icon" :src="benefit.image" alt="" />
        <div class="title" v-html="marked.parse(benefit.title)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';

  const props = defineProps<{
    icon: string,
    label: string,
    items: {image: string, title: string }[],
  }>();
</script>

<style lang="scss" src="./style.scss"/>
