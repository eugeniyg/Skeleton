<template>
  <button class="btn-modal-close" @click.prevent="emit('close')">
    <atomic-icon id="arrow_previous"/>
    <atomic-icon id="close"/>
  </button>
</template>
<script setup lang="ts">
  const emit = defineEmits(['close']);
</script>

<style lang="scss">
.btn-modal-close {
  @extend %skip-btn;
  min-width: rem(32px);
  min-height: rem(32px);
  position: var(--position, absolute);
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: var(--bg, var(--gray-900));
  top: var(--top, 0);
  right: var(--right, #{rem(-4px)});
  cursor: pointer;
  transform: translate(0, -50%);

  .icon {
    visibility: var(--visibility, hidden);
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    margin: auto;
    --color: var(--white);
    --icon-size: 22px;

    @include media(sm) {
      --color: var(--gray-400);
    }

    &:first-of-type {
      --visibility: hidden;
    }

    &:last-of-type {
      background: transparent;
      --visibility: visible;
    }
  }

  @include use-hover {
    &:hover {
      background-color: var(--gray-800);

      .icon {
        --color: var(--yellow-400);
      }
    }
  }
}
</style>
