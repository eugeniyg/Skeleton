<template>
  <span class="btn-verify" v-show="props.isShown">
    <slot />
  </span>
</template>

<script setup lang="ts">
  const props = defineProps({
    isShown: {
      type: Boolean,
      default: false,
    },
  });
</script>

<style lang="scss">
.btn-verify {
  @extend %skip-btn;
  @extend %flex-all-center;
  background: var(--bg, var(--gradient-new));
  position: absolute;
  top: 1px;
  bottom: 1px;
  right: 1px;
  @include font($heading-2);
  border-radius: 0 8px 8px 0;
  padding: 0 #{rem(24px)};
  --color: var(--gray-900);

  &:hover {
    cursor: pointer;
    --bg: var(--gradient-radial-hover);
  }

  &:active, &.is-active {
    --bg: var(--gradient-radial-focus);
    --color: var(--gray-900);
  }
}
</style>
