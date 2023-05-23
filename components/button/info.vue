<template>
  <button class="btn-info" @click="onClick">
    <atomic-icon id="info"/>
  </button>
</template>

<script setup lang="ts">
  const emit = defineEmits(['game-play']);

  function onClick(e:Event):void {
    emit('game-play', e);
  }
</script>

<style lang="scss">
.btn-info {
  display: flex;
  justify-content: center;
  align-items: center;
  @extend %skip-btn;
  width: rem(24px);
  height: rem(24px);
  padding: 0;
  border-radius: 8px;
  background-color: var(--bgc, transparent);
  --icon-size: 20px;
  --color: var(--violet-100);

  @include use-hover {
    &:hover {
      cursor: pointer;
      --bgc: var(--violet-900);
      --color: var(--yellow-500);
    }
  }
}
</style>
