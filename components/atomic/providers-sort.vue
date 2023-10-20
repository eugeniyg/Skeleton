<template>
  <div class="providers-sort">
    <span class="providers-sort__label">{{ props.sortLabel }}:</span>

    <div class="providers-sort__options">
      <div
        v-for="{ label, sortBy, sortOrder } in sortOptions"
        class="providers-sort__option"
        :key="label"
        :class="{ 'is-selected': props.sortByValue === sortBy && props.sortOrderValue === sortOrder }"
        @click="changeSort(sortBy, sortOrder)"
      >
        {{ label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IGamesPage } from '~/types';

const props = defineProps<{
  sortByValue: string,
  sortOrderValue: string,
  sortLabel: string,
  sortOptions: IGamesPage['sortOptions']
}>();

const emit = defineEmits(['change']);
const changeSort = (sortBy: string, sortOrder: string):void => {
  if (props.sortByValue !== sortBy || props.sortOrderValue !== sortOrder) {
    emit('change', sortBy, sortOrder);
  }
};
</script>

<style src="~/assets/styles/components/atomic/providers-sort.scss" lang="scss" />