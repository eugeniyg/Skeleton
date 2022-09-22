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

<style lang="scss" src="./style.scss"/>
