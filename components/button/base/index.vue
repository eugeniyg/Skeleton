<template>
  <component
    :is="props.tagName"
    :class="componentClasses"
    :href="'#'"
    :disabled="props.isDisabled || null"
  >
    <slot/>
  </component>
</template>

<script setup lang="ts">
  const props = defineProps({
    tagName: {
      type: String,
      validator: (val:string) => ['a', 'div', 'span', 'button'].includes(val),
      default: 'a',
    },
    type: {
      type: String,
      validator: (val:string) => ['primary', 'secondary', 'ghost', ''].includes(val),
      default: '',
    },
    size: {
      type: String,
      validator: (val:string) => ['xs', 'sm', 'md', 'lg', ''].includes(val),
      default: '',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  });

  const componentClasses = computed(() => [
    props.type ? `btn-${props.type}` : 'btn',
    props.size ? `size-${props.size}` : '',
    props.isActive ? 'is-active' : null,
  ]);
</script>

<style lang="scss" src="./style.scss"/>
