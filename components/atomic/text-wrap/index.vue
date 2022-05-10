<template>
  <div class="text-wrap" :class="classes">
    <slot/>
    <button-show-more v-if="props.hideText" @show-more="showText = true"/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    hideText: {
      type: Boolean,
      default: false,
    },
  });
  const showText = ref<boolean>(false);
  const classes = computed(() => [
    props.hideText && !showText.value ? 'text-hidden' : null,
    { 'text-show': showText.value },
  ]);
</script>

<style lang="scss" src="./style.scss"/>
