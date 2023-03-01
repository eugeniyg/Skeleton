<template>
  <button class="btn-logout" @click="emit('logout')">
    <atomic-icon id="log-out"/>
    {{ getContent(userNavigationContent, defaultLocaleUserNavigationContent, 'logoutButton') }}
  </button>
</template>

<script setup lang="ts">
  const emit = defineEmits(['logout']);
  const { getContent } = useProjectMethods();
  const { userNavigationContent, defaultLocaleUserNavigationContent } = useGlobalStore();
</script>

<style lang="scss">
.btn-logout {
  @extend %skip-btn;
  padding: rem(6px) rem(8px);
  display: flex;
  align-items: center;
  @include font($body-1);
  grid-column-gap: rem(8px);
  color: var(--color, var(--white));
  background-color: var(--bg, transparent);
  transition: color .2s ease-in-out;

  .icon {
    --color: var(--gray-400);
  }

  &:hover {
    --bg: var(--gray-800);
    --color: var(--yellow-500);
    --shadow: unset;
    cursor: pointer;

    .icon {
      --color: inherit;
    }
  }

  &:focus {
    --bg: var(--gray-700);
    --color: var(--yellow-500);
    --shadow: inset 0 2px 0 var(--gray-800);

    .icon {
      --color: inherit;
    }
  }

  &[disabled] {
    pointer-events: none;
    --bg: transparent;
    --color: var(--gray-600);
  }
}
</style>
