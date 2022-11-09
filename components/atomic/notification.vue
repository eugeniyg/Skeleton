<template>
  <a
    class="notification"
    href="#"
    :class="{'is-active': props.isActive, 'is-shown': isShown}"
    @click.prevent="toggle"
    @focusout="toggle"
  >
    <atomic-icon id="notification"/>
    <atomic-bulb v-if="props.isActive"/>
  </a>
</template>

<script setup lang="ts">
  const props = defineProps({
    isActive: {
      type: Boolean,
      default: false,
    },
  });
  const isShown = ref<boolean>(false);

  function toggle(): void {
    setTimeout(() => {
      isShown.value = !isShown.value;
    }, 200);
  }
</script>

<style lang="scss">
.notification {
  @extend %flex-all-center;
  @include box(40px);
  @include radius(8px);
  position: relative;
  background-color: var(--bg, transparent);
  transition: all .2s ease-in-out;
  text-decoration: none;
  display: var(--display, none);

  @include media(l) {
    --display: flex;
  }

  .icon {
    --color: var(--gray-400);
  }

  .bulb {
    position: absolute;
    top: rem(8px);
    right: rem(8px);
    display: var(--display, none);
  }

  &.is-active {
    .bulb {
      --display: block;
    }

    &:before {
      --icon-color: var(--white);
    }
  }

  @include use-hover {
    &:hover {
      cursor: pointer;
      --bg: var(--gray-800);

      .icon {
        color: var(--yellow-500);
      }
    }
  }

  &.is-shown {
    box-shadow: inset 0 3px 0 var(--gray-800);
    --bg: var(--gray-700);

    &:before {
      --icon-color: var(--yellow-500);
    }

    ~ .popover-notifications {
      --visibility: visible;
    }
  }
}
</style>
