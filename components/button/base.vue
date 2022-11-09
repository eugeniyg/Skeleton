<template>
  <component
    :is="props.url ? NuxtLink : props.tagName"
    :class="componentClasses"
    :disabled="props.isDisabled || null"
    :to="localizePath(url)"
  >
    <slot/>
  </component>
</template>

<script setup lang="ts">
  const props = defineProps({
    tagName: {
      type: String,
      validator: (val:string) => ['div', 'span', 'button'].includes(val),
      default: 'div',
    },
    type: {
      type: String,
      validator: (val:string) => ['primary', 'secondary', 'ghost', ''].includes(val),
      default: '',
    },
    size: {
      type: String,
      validator: (val:string) => ['xs', 'sm', 'md', 'lg', ''].includes(val),
      default: '',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
      required: false,
    },
  });

  const { localizePath } = useProjectMethods();
  const NuxtLink = resolveComponent('nuxt-link');

  const componentClasses = computed(() => [
    props.type ? `btn-${props.type}` : 'btn',
    props.size ? `size-${props.size}` : '',
    props.isActive ? 'is-active' : null,
  ]);
</script>

<style lang="scss">
.btn {
  @extend %skip-btn;
  @extend %link;
  @extend %flex-all-center;
  padding: var(--padding, rem(4px) rem(16px));
  border-radius: var(--btn-border-radius, 8px);
  width: var(--width, fit-content);
  height: var(--height, auto);
  grid-column-gap: rem(4px);
  transition: background-color .1s, color .1s ease-in-out;
  user-select: none;

  &:hover {
    cursor: pointer;
  }
}

.btn {
  &.size-xs {
    @include font($heading-1);
    --padding: #{rem(4px) rem(16px)};
    --btn-border-radius: 8px;
  }

  &.size-sm {
    @include font($heading-2);
    --padding: #{rem(7px) rem(20px)};
    --btn-border-radius: 8px;
  }

  &.size-md {
    @include font($heading-2);
    --padding: #{rem(11px) rem(24px)};
    --btn-border-radius: 12px;
  }

  &.size-lg {
    @include font($heading-3);
    --padding: #{rem(16px) rem(40px)};
    --btn-border-radius: 8px;
  }
}

.btn-primary {
  box-shadow: var(--shadow, none);
  @extend .btn;

  --bg: var(--gradient-new);
  --color: var(--gray-900);

  &:hover {
    --bg: var(--gradient-new-hover);
    --color: var(--black-primary);
  }

  &:focus, &.is-active {
    --bg: var(--gradient-new-focus);
    --color: var(--black-primary);
  }

  &[disabled] {
    pointer-events: none;

    --bg: var(--yellow-900);
    --color: var(--black-primary);
  }
}

.btn-secondary {
  @extend .btn;
  --bg: var(--gray-800);
  --color: var(--white);

  &:hover {
    --bg: var(--gray-800);
    --color: var(--yellow-500);
    --shadow: 0 0 3px var(--gray-900);
  }

  &:focus, &.is-active {
    --bg: var(--gray-700);
    --color: var(--yellow-500);
    --shadow: inset 0 2px 0 #B07B00;
  }

  &[disabled] {
    pointer-events: none;
    --bg: var(--gray-800);
    --color: var(--gray-500);
  }
}

.btn-ghost {
  @extend .btn;
  --bg: transparent;
  --color: var(--white);

  &:hover {
    --bg: var(--gray-800);
    --color: var(--yellow-500);
    --shadow: unset;
  }

  &:focus, &.is-active {
    --bg: var(--gray-700);
    --color: var(--yellow-500);
    --shadow: inset 0 2px 0 var(--gray-800);
  }

  &[disabled] {
    pointer-events: none;
    --bg: transparent;
    --color: var(--gray-600);
  }
}
</style>
