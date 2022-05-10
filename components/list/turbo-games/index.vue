<template>
  <div class="turbo-games" :class="{'is-compact' : props.isCompact}">
    <a
      v-for="(item, index) in props.items"
      :key="index"
      class="item"
      href="#"
    >
      <img class="img" :src="`/img/${item}`" alt="" />
    </a>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
    isCompact: {
      type: Boolean,
      default: false,
    },
  });
</script>

<style lang="scss" src="./style.scss"/>
