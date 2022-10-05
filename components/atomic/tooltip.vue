<template>
  <div class="tooltip">
    <atomic-icon :id="props.icon"/>

    <div class="message">
      <div class="title" v-if="props.title">{{ props.title }}</div>
      <div class="text" v-if="props.text">{{ props.text }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    icon: {
      type: String,
      default: 'info',
    },
    title: {
      type: String,
    },
    text: {
      type: String,
    },
  });
</script>

<style lang="scss">
.tooltip {
  position: relative;
  z-index: 1;
  width: rem(20px);
  height: rem(20px);

  .icon {
    --icon-size: #{rem(20px)};
    --color: var(--gray-500);
    cursor: pointer;
    transition: color .2s ease-in-out;
  }

  &:hover {
    --tooltip-visibility: visible;

    .icon {
      --color: var(--white);
    }
  }

  .message {
    position: absolute;
    display: grid;
    background-color: var(--gray-700);
    grid-gap: rem(4px);
    padding: rem(8px);
    margin: 0;
    text-decoration: none;
    color: var(--white);
    width: rem(248px);
    right: 0;
    top: 0;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.16);
    border-radius: 2px;
    visibility: var(--tooltip-visibility, hidden);
    transform: translateY(-100%) translateX(rem(16px));
  }

  .title {
    @include font($heading-1);
    margin: 0;
    padding: 0;
    text-decoration: inherit;
    color: inherit;
  }

  .text {
    @include font($body-1);
    margin: 0;
    padding: 0;
    text-decoration: inherit;
    color: inherit;
  }
}
</style>
