<template>
  <div class="arrows">
    <button
      :key="'prev'"
      class="btn-prev"
      :disabled="props.prevDisabled"
      data-action="prev"
      @click="clickNavigation('prev')"
    >
      <atomic-icon id="arrow_expand-close"/>
    </button>

    <button
      :key="'next'"
      class="btn-next"
      :disabled="props.nextDisabled"
      data-action="next"
      @click="clickNavigation('next')"
    >
      <atomic-icon id="arrow_expand-close"/>
    </button>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    prevDisabled: {
      type: Boolean,
      default: true,
    },
    nextDisabled: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits(['clickAction']);
  const clickNavigation = (direction:string):void => {
    if ((direction === 'next' && props.nextDisabled) || (direction === 'prev' && props.prevDisabled)) return;
    emit('clickAction', direction);
  };
</script>

<style lang="scss">
.arrows {
  @extend %flex-items-center;
  grid-column-gap: 4px;
  padding: rem(3px);
  margin-left: rem(3px);

  .btn-prev, .btn-next {
    @include box(32px);
    @extend %flex-all-center;
    @extend %skip-btn;
    border-radius: 50%;
    box-shadow: var(--shadow, none);

    --bg: var(--gray-800);
    --color: var(--white);

    @include media(l) {
      &:hover {
        cursor: pointer;
        --bg: var(--gray-800);
        --color: var(--yellow-500);
        --shadow: 0 0 0 #{rem(3px)} var(--gray-900);
      }
    }

    &[disabled] {
      --color: var(--gray-600);
      --bg: var(--gray-800);
    }
  }

  .btn-prev {
    transform: rotate(90deg);
  }

  .btn-next {
    transform: rotate(-90deg);
  }
}
</style>
