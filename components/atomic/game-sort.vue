<template>
  <div class="game-sort">
    <span class="label">{{ props.sortLabel }}:</span>

    <button
      v-for="{ label, sortBy, sortOrder } in sortOptions"
      :key="label"
      :class="{ 'is-selected': props.sortByValue === sortBy && props.sortOrderValue === sortOrder }"
      @click="changeSort(sortBy, sortOrder)"
    >
      {{ label }}
    </button>
  </div>
</template>

<script setup lang="ts">

  import { SortOptionInterface } from '~/types';

  const props = defineProps<{
    sortByValue: string,
    sortOrderValue: string,
    sortLabel: string,
    sortOptions: SortOptionInterface[]
  }>();

  const emit = defineEmits(['change']);
  const changeSort = (sortBy: string, sortOrder: string):void => {
    if (props.sortByValue !== sortBy || props.sortOrderValue !== sortOrder) {
      emit('change', sortBy, sortOrder);
    }
  };
</script>

<style lang="scss">
.game-sort {
  display: flex;
  align-items: center;
  grid-column-gap: rem(4px);

  .label {
    @include font($body-1);
    color: var(--gray-500);
    margin-right: rem(4px);
  }

  button {
    @extend %skip-btn;
    padding: rem(4px) rem(8px);
    border-radius: 8px;
    background-color: var(--bg, transparent);
    color: var(--color, var(--gray-300));
    transition: all .2s ease-in-out;
    cursor: pointer;
    @include font($body-1);

    &.is-selected {
      --bg: var(--gray-700);
      --color: var(--white);
    }
  }
}
</style>
