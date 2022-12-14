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
  position: var(--position, relative);
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: var(--bg, var(--gray-800));
  top: var(--top, 0);
  right: var(--right, 0);
  cursor: pointer;

  .icon {
    visibility: var(--visibility, hidden);
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    margin: auto;
    --icon-size: 24px;

    &:first-of-type {
      --visibility: visible;
      --color: var(--white);
    }

    &:last-of-type {
      --visibility: hidden;
      --color: var(--gray-400);
    }
  }

  @include media(md) {
    cursor: pointer;
    --top: 0;
    --right: 0;
    --bg: transparent;
    --position: absolute;

    &:hover {
      --bg: var(--gray-800);
      transition: background-color .2s ease-in-out;

      .icon {
        --color: var(--yellow-500);
      }
    }

    .icon:first-of-type {
      --visibility: hidden
    }

    .icon:last-of-type {
      --visibility: visible
    }
  }
}
</style>
