<template>
  <button class="btn-play" @click="onClick">
    <atomic-icon id="play"/>
  </button>
</template>

<script setup lang="ts">
  const emit = defineEmits(['game-play']);

  function onClick(e:Event):void {
    emit('game-play', e);
  }
</script>

<style lang="scss">
.btn-play {
  @include box(40px);
  @extend %skip-btn;
  @extend %flex-all-center;
  border-radius: 50%;
  background-image: var(--bg, var(--gradient-radial));
  box-shadow: var(--shadow, unset);
  transition: all .2s ease-in-out;
  position: relative;

  .icon {
    transform: translateX(1px);
  }

  --padding: 0 0;
  --color: var(--gray-900);
  --icon-size: 24px;
  --width: 48px;
  --height: 48px;

  &:hover {
    cursor: pointer;
    --bg: var(--gradient-radial-hover);
  }

  &:active, &.is-active {
    --bg: var(--yellow-600);
    --color: var(--gray-900);
  }
}
</style>
