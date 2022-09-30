<template>
  <div class="cat-heading">
    <atomic-icon :id="props.icon"/>
    <slot/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{icon: string}>();
</script>

<style lang="scss">
.cat-heading {
  display: flex;
  align-items: center;
  @include font($heading-4);
  color: var(--white);
  grid-column-gap: rem(8px);
  padding-top: var(--padding-top, #{rem(8px)});

  @include media(l) {
    --padding-top: #{rem(24px)};
  }

  .icon {
    --color: var(--gray-400);
  }
}
</style>
