<template>
  <component
    :is="props.url ? AtomicLink : props.tagName"
    :class="componentClasses"
    :disabled="props.isDisabled || null"
    :href="props.url"
    :targetBlank="props.targetBlank || null"
  >
    <slot/>
  </component>
</template>

<script setup lang="ts">
  const props = defineProps({
    targetBlank: {
      type: Boolean,
      default: false,
    },
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
  const AtomicLink = resolveComponent('atomic-link');

  const componentClasses = computed(() => [
    props.type ? `btn-${props.type}` : 'btn',
    props.size ? `size-${props.size}` : '',
    props.isActive ? 'is-active' : null,
  ]);
</script>

<style src="~/assets/styles/components/button/base.scss" lang="scss" />

