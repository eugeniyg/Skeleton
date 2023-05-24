<template>
  <button
    class="btn-search"
    @click="emit('show-search')"
    :class="{'is-active': active}"
  >
    <atomic-icon id="search"/>
  </button>
</template>

<script setup lang="ts">
  const emit = defineEmits(['show-search']);

  const props = defineProps({
    isActive: {
      type: Boolean,
      default: false,
    },
  });

  const active = computed(() => props.isActive);
</script>

<style lang="scss">
.btn-search {
  display: var(--display, none);
  @include box(40px);
  @include radius(12px);
  @extend %skip-btn;
  @extend %flex-all-center;
  position: relative;
  box-shadow: var(--shadow, unset);
  right: 0;

  --icon-size: #{rem(20px)};
  --padding: 0 0;
  --color: var(--gray-400);

  &[data-show="mobile"] {
    --display: block;

    @include media(l) {
      --display: none;
    }
  }

  &[data-show="desktop"] {

    @include media(l) {
      --display: block;
    }
  }

  //@include media(xs) {
  //  &:before {
  //    display: none;
  //  }
  //}

  @include use-hover {
    &:hover {
      cursor: pointer;

      --color: var(--yellow-500);

      @include media(l) {
        --bg: var(--gray-800);
      }

      &:before {
        opacity: 0;
      }
    }
  }

  &.is-active {
    --color: var(--yellow-500);
  }

}
</style>
