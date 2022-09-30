<template>
  <div class="row-user-agent">
    <slot>user agent text</slot>
    <atomic-tooltip :text="props.tooltip"/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{tooltip: string}>();
</script>

<style lang="scss">
.row-user-agent {
  color: var(--color, var(--white));
  display: flex;
  align-items: center;
  grid-column-gap: rem(4px);
  @include font($body-2);

  .icon {
    --color: var(--gray-500);
    --icon-size: #{rem(20px)};
  }

  .tooltip .message {
    left: 50%;
    right: auto;
    transform: translateY(calc(-100% - 4px)) translateX(-50%);
  }
}
</style>
