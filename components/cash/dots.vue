<template>
  <div class="cash-dots">
    <div
      class="cash-dots__item"
      :class="{'is-active': index === props.activeIndex}"
      :data-index="item"
      v-for="(item, index) in props.itemsCount"
    />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    itemsCount: number,
    activeIndex: number
  }>();
</script>

<style src="~/assets/styles/components/cash/dots.scss" lang="scss"/>