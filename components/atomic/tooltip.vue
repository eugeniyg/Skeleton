<template>
  <button
    ref="tooltip"
    class="tooltip"
    @click="show"
    :class="{'is-show': isShow}"
    @mouseover="show"
    @mouseleave="hide"
    @focusout="hide"
  >
    <atomic-icon :id="props.icon"/>
    <Teleport to="[data-tooltip-parent]">
      <div
        ref="tooltipMsg"
        class="tooltip__message"
        :class="{'is-active': isShow}"
        :style="`top: ${coords.top}px; left: ${coords.left}px`"
      >
        <div class="title" v-if="props.title">{{ props.title }}</div>
        <div class="text" v-if="props.text">{{ props.text }}</div>
      </div>
    </Teleport>
  </button>
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

  const coords = reactive({
    top: 0,
    left: 0,
  });

  const tooltip = ref(null);
  const tooltipMsg = ref(null);
  const isShow = ref<boolean>(false);

  const getTooltipParent = () => tooltip.value.closest('[data-tooltip-parent]');

  const setCoords = () => {
    const parent = getTooltipParent();
    const pRect = parent.getBoundingClientRect();
    const tRect = tooltip.value.getBoundingClientRect();
    const mRect = tooltipMsg.value.getBoundingClientRect();

    const lockLeft = pRect.x - tRect.width / 2 >= tRect.x - mRect.width / 2;
    const lockRight = pRect.x - tRect.width / 2 + pRect.width - mRect.width / 2 <= tRect.x;

    if (lockLeft) {
      coords.left = pRect.x;
      coords.top = tRect.y;
    } else if (lockRight) {
      coords.left = (pRect.x + pRect.width) - (mRect.width);
      coords.top = tRect.top;
    } else {
      coords.left = (tRect.x + tRect.width) - mRect.width / 2;
      coords.top = tRect.top;
    }
  };

  const show = () => {
    setCoords();
    isShow.value = true;
  };

  const hide = () => {
    isShow.value = false;
  };
</script>

<style lang="scss">
.tooltip {
  position: relative;
  z-index: 0;
  width: rem(20px);
  height: rem(20px);
  display: flex;
  align-items: center;
  @extend %skip-btn;

  .icon {
    transition: color .2s ease-in-out;
    cursor: pointer;
    --icon-size: #{rem(20px)};
    --color: var(--gray-500);
  }

  @media (hover: hover) {
    &:hover {
      --tooltip-visibility: visible;

      .icon {
        --color: var(--white);
      }
    }
  }

  &.is-show {
    --visibility: visible;
    --opacity: 1;

    .icon {
      --color: var(--white);
    }
  }

  &__message {
    @include font($body-1);
    position: fixed;
    display: grid;
    background-color: var(--gray-700);
    grid-gap: rem(4px);
    padding: rem(8px);
    margin: 0;
    text-decoration: none;
    color: var(--white);
    min-width: min-content ;
    max-width: #{rem(240px)};
    left: 0;
    top: 0;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.16);
    border-radius: 2px;
    visibility: var(--visibility, hidden);
    opacity: var(--opacity, 0);
    transform: translateY(calc(-100% - 4px)) ;
    transition: opacity .2s ease-in;
    pointer-events: none;
    z-index: 7;

    &.is-active {
      --visibility: visible;
      --opacity: 1;

      [data-tooltip-parent] & {
        --visibility: visible;
        --opacity: 1;
      }
    }
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
