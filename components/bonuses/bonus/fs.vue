<template>
  <div class="bonus-fs" :class="{'is-active': props.isActive }">
    <div class="bonus-fs__container">
      <div class="bonus-fs__header">fs header</div>
      <div class="bonus-fs__body">fs body</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    isActive?: boolean;
  }>()
</script>

<style src="~/assets/styles/components/bonuses/bonus/fs.scss" lang="scss"/>
