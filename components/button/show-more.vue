<template>
  <button class="btn-show-more" @click="onClick">
    <slot/>
    <atomic-icon id="arrow_expand-close"/>
  </button>
</template>

<script setup lang="ts">
  const emit = defineEmits(['show-more']);
  function onClick():void {
    emit('show-more');
  }
</script>

<style lang="scss">
.btn-show-more {
  font-family: 'NeoSansPro', sans-serif;
  @include font($heading-1);
  @extend %flex-all-center;
  @extend %skip-btn;
  width: 100%;
  padding: rem(4px);
  margin-top: rem(8px);
  grid-gap: rem(4px);
  cursor: pointer;
  transition: color .2s ease-in-out;

  --color: var(--gray-400);
  --icon-size: #{rem(20px)};

  &:hover {
    --color: var(--white);
  }
}
</style>
