<template>
  <div class="providers-sort">
    <span class="providers-sort__label">{{ props.label }}</span>

    <div class="providers-sort__options">
      <div
        v-for="option in sortOptions"
        :key="option.label"
        class="providers-sort__option"
        :class="{ 'is-selected': props.sortBy === option.sortBy && props.sortOrder === option.sortOrder }"
        @click="changeSort(option.sortBy, option.sortOrder)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ICategoryPage } from '~/types';

  const props = defineProps<{
    label: string;
    sortBy?: string;
    sortOrder?: string;
    sortOptions: ICategoryPage['sortOptions'];
  }>();

  const emit = defineEmits(['change']);
  const changeSort = (sortBy: string, sortOrder: string): void => {
    if (props.sortBy !== sortBy || props.sortOrder !== sortOrder) {
      emit('change', { sortBy, sortOrder });
    }
  };
</script>

<style src="~/assets/styles/components/atomic/providers-sort.scss" lang="scss" />
