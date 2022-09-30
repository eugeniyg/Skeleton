<template>
  <div class="btn-copy__wrap">
    <input
      class="btn-copy__input"
      ref="input"
      type="text"
      :value="props.text"
      readonly
    >

    <transition name="fade" mode="out-in">
      <div v-if="tooltipVisible" class="btn-copy__tooltip">{{ props.copyTooltip}}</div>
    </transition>

    <button class="btn-copy" @click="actionClick">
      {{ props.copyButton }}
      <atomic-icon id="ui-copy"/>
    </button>
  </div>
</template>

<script setup lang="ts">
  const input = ref(null);
  const props = defineProps<{
    text: string,
    copyButton: string,
    copyTooltip: string,
  }>();

  const tooltipVisible = ref<boolean>(false);
  const tooltipTimer = ref<any>(undefined);

  const showTooltip = ():void => {
    tooltipVisible.value = true;
    clearTimeout(tooltipTimer.value);
    tooltipTimer.value = setTimeout(() => {
      tooltipVisible.value = false;
    }, 2000);
  };

  const actionClick = () => {
    input.value.focus();
    input.value.select();
    document.execCommand('copy');
    showTooltip();
  };
</script>

<style lang="scss">
.btn-copy {
  background-color: var(--copy-btn-bg, transparent);
  @extend %skip-btn;
  @include font($heading-1);
  padding: rem(2px) rem(16px);
  display: flex;
  align-items: center;
  grid-column-gap: rem(4px);
  color: var(--color, var(--gray-400));
  cursor: pointer;
  border-radius: 999px;
  flex: none;
  order: 1;
  flex-grow: 0;
  z-index: 1;
  min-height: rem(24px);

  &__wrap {
    position: relative;
  }

  &__input {
    position: absolute;
    right: 0;
    z-index: -1;
    pointer-events: none;
    opacity: 0;

    &:focus {
      ~ .btn-copy {
        --copy-btn-bg: var(--gray-700);
        --color: var(--yellow-500);

        .icon {
          --color: var(--yellow-500);
        }
      }
    }
  }

  .icon {
    --color: var(--gray-400);
    --icon-size: 20px;
  }

  @media (hover: hover) {
    &:hover {
      --color: var(--yellow-500);
      transition: color .2s ease-in-out;

      .icon {
        --color: var(--yellow-500);
      }
    }
  }

  &__tooltip {
    position: absolute;
    bottom: calc(100% + 4px);
    right: -24px;
    padding: 2px 8px;
    background-color: var(--green-700);
    color: var(--white);
    white-space: nowrap;

    @include font($body-1);
  }
}
</style>
