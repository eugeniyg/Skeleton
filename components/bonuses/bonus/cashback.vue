<template>
  <div class="bonus-cashback" :class="{'is-active': props.isActive }">
    <div class="bonus-cashback__container">
      <div class="bonus-cashback__header">cashback header</div>
      <div class="bonus-cashback__body">cashback body</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    isActive?: boolean;
  }>()
</script>

<style src="~/assets/styles/components/bonuses/bonus/cashback.scss" lang="scss"/>
