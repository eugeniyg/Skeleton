<template>
  <div class="bonus-percent" :class="{'is-active': props.isActive }">
    <div class="bonus-percent__container">
      <div class="bonus-cash__header">
        <bonuses-badge variant="percent"/>
        <bonuses-badge-status status="active"/>
      </div>
      
      <div class="bonus-cash__body">
        <bonuses-progress :value="10"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    isActive?: boolean;
  }>()
</script>

<style src="~/assets/styles/components/bonuses/bonus/percent.scss" lang="scss"/>
