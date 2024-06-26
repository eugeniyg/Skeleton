<template>
  <div class="quest-fields-to-complete">
    <div class="quest-fields-to-complete__title">Fields to complete</div>
    <div class="quest-fields-to-complete__items">
      <span v-for="item in props.items" class="quest-fields-to-complete__item">
        <atomic-image src="/img/quest/quest-check.png"/>
        <span>{{ item }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    items: string[]
  }>()
</script>

<style src="~/assets/styles/components/quest/fields-to-complete.scss" lang="scss"/>
