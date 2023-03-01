<template>
  <button class="btn-deposit" @click="openDepositModal">
    <atomic-icon id="plus"/>

    <span>
      {{ getContent(headerContent, defaultLocaleHeaderContent, 'depositButton') }}
    </span>
  </button>
</template>

<script setup lang="ts">
  const { openDepositModal } = useLayoutStore();
  const { getContent } = useProjectMethods();
  const { headerContent, defaultLocaleHeaderContent } = useGlobalStore();
</script>

<style lang="scss">
.btn-deposit {
  @extend %skip-btn;
  @include box(40px);
  @extend %flex-all-center;
  border-radius: var(--radius, 12px);
  padding: var(--btn-padding, 0);
  grid-column-gap: rem(4px);

  span {
    @include font($heading-2);
    display: var(--display, none);
  }

  --bg: var(--gradient-new);
  --color: var(--gray-900);

  @include media(md) {
    --width: auto;
    --radius:  12px;
    --btn-padding: #{rem(11px)} #{rem(24px)};

    span {
      --display: block;
    }
  }

  &:hover {
    cursor: pointer;
    --bg: var(--gradient-new-hover);
    --color: var(--black-primary);
  }

  &:focus {
    --bg: var(--gradient-new-focus);
    --color: var(--black-primary);
  }
}
</style>
