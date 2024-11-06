<template>
  <component
    :is="props.url ? AtomicLink : (props.tagName ?? 'div')"
    :class="componentClasses"
    :disabled="props.isDisabled || null"
    :href="props.url"
    :target-blank="props.targetBlank || null"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
  const props = defineProps<{
    targetBlank?: boolean;
    tagName?: 'div' | 'span' | 'button';
    type?: 'primary' | 'secondary' | 'ghost' | 'ghost-gray';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    isDisabled?: boolean;
    isActive?: boolean;
    url?: string;
  }>();

  const AtomicLink = resolveComponent('atomic-link');

  const componentClasses = computed(() => [
    props.type ? `btn-${props.type}` : 'btn',
    props.size ? `size-${props.size}` : '',
    props.isActive ? 'is-active' : null,
  ]);
</script>

<style src="~/assets/styles/components/button/base.scss" lang="scss" />
