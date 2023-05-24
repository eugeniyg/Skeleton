<template>
  <button
    class="btn-deposit"
    :class="{'is-active': isActive}"
    @click="makeActive"
    v-click-outside="makeInactive"
  >
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
  const isActive = ref<boolean>(false);

  const makeActive = () => {
    isActive.value = true;
    openDepositModal();
  };

  const makeInactive = () => {
    isActive.value = false;
  };
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
    --radius: 12px;
    --btn-padding: #{rem(11px)} #{rem(24px)};

    span {
      --display: block;
    }
  }

  @include use-hover {
    &:hover {
      cursor: pointer;
      --bg: var(--gradient-new-hover);
      --color: var(--black-primary);
    }
  }

  &.is-active {
    --bg: var(--gradient-new-focus);
    --color: var(--black-primary);
  }
}
</style>
