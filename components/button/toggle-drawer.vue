<template>
  <div class="toggle-drawer">
    <button-base @click="emit('toggle-minimize')" data-action="minimize">
      <atomic-icon id="arrow_expand-close"/>
    </button-base>
    <button-base @click="emit('toggle-open')" data-action="open">
      <atomic-icon id="arrow_expand-close"/>
    </button-base>
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits(['toggle-minimize', 'toggle-open']);
</script>

<style lang="scss">
.toggle-drawer {
  .btn {
    @include box(32px);
    @extend %flex-all-center;
    display: var(--btn-display, none);
    justify-content: center;
    align-items: center;
    @extend %skip-btn;
    border-radius: 8px;
    padding: 0;
    position: var(--position, absolute);
    transform: var(--translate, translate(50%, 50%));
    transition: unset;
    right: var(--right, 0);

    --bg: var(--gray-800);
    --color: var(--white);
    --icon-size: #{rem(24px)};

    .icon {
      transform: rotate(90deg) scaleY(var(--scaleY, 1));
    }

    &:hover {
      cursor: pointer;
    }

    &.is-compact {
      @include media(l) {
        --bg: var(--gray-800);
      }
    }

    &[data-action="minimize"] {
      @include media(l) {
        --btn-display: flex;
      }

    }

    &[data-action="open"] {
      --btn-display: flex;

      @include media(l) {
        --btn-display: none;
      }
    }
  }

  .is-compact & {
    @include media(l) {
      padding: rem(16px) rem(20px);
      background-color: var(--gray-900);

      --scaleY: -1;
      --position: relative;
      --translate: 0 0;
      --right: auto
    }
  }
}
</style>
