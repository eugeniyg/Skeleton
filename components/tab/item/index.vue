<template>
  <div class="tab" :class="{'is-active': props.isActive}">
    <slot/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    isActive: {
      type: Boolean,
      default: false,
    },
  });
</script>

<style lang="scss" src="./style.scss"/>
