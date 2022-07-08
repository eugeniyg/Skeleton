<template>
  <component
    :is="props.url ? NuxtLink : props.tagName"
    :class="componentClasses"
    :disabled="props.isDisabled || null"
    :to="localizePath(url)"
  >
    <slot/>
  </component>
</template>

<script setup lang="ts">
  const props = defineProps({
    tagName: {
      type: String,
      validator: (val:string) => ['div', 'span', 'button'].includes(val),
      default: 'div',
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
    url: {
      type: String,
      required: false,
    },
  });

  const { localizePath } = useProjectMethods();
  const NuxtLink = resolveComponent('nuxt-link');

  const componentClasses = computed(() => [
    props.type ? `btn-${props.type}` : 'btn',
    props.size ? `size-${props.size}` : '',
    props.isActive ? 'is-active' : null,
  ]);
</script>

<style lang="scss" src="./style.scss"/>
