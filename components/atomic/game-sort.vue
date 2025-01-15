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
  import type { ICategoryPage } from '@/types';

  const props = defineProps<{
    sortByValue: string;
    sortOrderValue: string;
    sortLabel: string;
    sortOptions: ICategoryPage['sortOptions'];
  }>();

  const emit = defineEmits(['change']);
  const changeSort = (sortBy: string, sortOrder: string): void => {
    if (props.sortByValue !== sortBy || props.sortOrderValue !== sortOrder) {
      emit('change', sortBy, sortOrder);
    }
  };
</script>

<style src="~/assets/styles/components/atomic/game-sort.scss" lang="scss" />
