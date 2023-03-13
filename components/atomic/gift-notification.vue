<template>
  <button
    class="gift-notification"
    :class="{'is-active': props.isActive}"
    :data-display="props.display"
    @click="$emit('go')"
  >
    <atomic-icon id="bonuses"/>
  </button>
</template>

<script setup lang="ts">
  const props = defineProps({
    display: {
      type: String,
      validator: (val:string) => ['desktop', 'mobile'].includes(val),
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  });
</script>

<style lang="scss">
.gift-notification {
  display: var(--display, none);
  @include box(40px);
  @extend %skip-btn;
  background-color: var(--bgc, transparent);
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  position: relative;

  &:after {
    display: block;
    content: '';
    @include box(12px);
    position: absolute;
    background-color: var(--bulb-color, transparent);
    border: 2px solid var(--bulb-border-color, transparent);
    right: 8px;
    top: 8px;
    border-radius: 50%;
  }

  &[data-display="mobile"] {
    --display: flex;

    @include media(l) {
      --display: none;
    }
  }

  &[data-display="desktop"] {
    @include media(l) {
      --display: flex;
    }
  }

  .icon {
    --color: var(--gray-400);
    --icon-size: 22px;
  }

  &.is-active {
    --bgc: transparent;

    --bulb-color: var(--green-500);
    --bulb-border-color: var(--black-primary);

    &:hover {
      --bgc: var(--gray-700);
    }

    .icon {
      --color: var(--white);
    }
  }

  &:hover {
    cursor: pointer;
    --bgc: var(--gray-800);

    .icon {
      --color: var(--yellow-500);
    }
  }

}
</style>
