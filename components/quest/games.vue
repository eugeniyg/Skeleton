<template>
  <div class="quest-games">
    <div class="quest-games__header">
      <div class="quest-games__header-title">Games</div>
      <div class="quest-games__header-all-btn">See all</div>
    </div>
    <div v-if="props.items.length" class="quest-games__items">
      <div v-for="item in props.items" class="quest-games__item">
        <atomic-image :src="item"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  items: string[]
}>()
</script>

<style src="~/assets/styles/components/quest/games.scss" lang="scss"/>
