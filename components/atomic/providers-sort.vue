<template>
  <div class="providers-sort">
    <span class="providers-sort__label">{{ props.label }}</span>

    <div class="providers-sort__options">
      <div
        v-for="{ label, sortBy, sortOrder } in sortOptions"
        class="providers-sort__option"
        :key="label"
        :class="{ 'is-selected': props.sortBy === sortBy && props.sortOrder === sortOrder }"
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
  label: string;
  sortBy?: string;
  sortOrder?: string;
  sortOptions: IGamesPage['sortOptions'];
}>();

const emit = defineEmits(['change']);
const changeSort = (sortBy: string, sortOrder: string):void => {
  if (props.sortBy !== sortBy || props.sortOrder !== sortOrder) {
    emit('change', { sortBy, sortOrder });
  }
};
</script>

<style src="~/assets/styles/components/atomic/providers-sort.scss" lang="scss" />