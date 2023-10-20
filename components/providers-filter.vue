<template>
  <div
    class="providers-filter"
    v-click-outside="clickOutside"
  >
    <form-input-search
      v-model:value="searchValue"
      class="providers-filter__search"
      placeholder="Search provider"
      @input="searchInput"
    />

    <div
      @click="toggleSort"
      class="providers-filter__toggle-sort"
      :class="{'is-active': isShowSort }"
    >
      <atomic-icon id="filter"/>
    </div>

    <atomic-providers-sort
      v-show="isShowSort"
      @change="changeSort"
      v-bind="sortProps"
    />
  </div>
</template>

<script setup lang="ts">
import debounce from 'lodash/debounce';

const searchValue = ref<string>('');
const isShowSort = ref<boolean>(false);

const sortProps = {
  sortOptions: [
    {
      'label': 'Most popular',
      'sortBy': 'default',
      'sortOrder': 'asc'
    },
    {
      'label': 'Recent',
      'sortBy': 'recent',
      'sortOrder': 'recent'
    },
    {
      'label': 'A-Z',
      'sortBy': 'name',
      'sortOrder': 'asc'
    },
    {
      'label': 'Z-A',
      'sortBy': 'name',
      'sortOrder': 'desc'
    }
  ],

  sortLabel: 'Sort by',
  sortOrderValue: 'asc',
  sortByValue: 'default',
};

const searchInput = debounce(async (): Promise<void> => {
  if (searchValue.value.length > 1 || !searchValue.value) {
    //
  }
}, 500, { leading: false });

const toggleSort = () => {
  isShowSort.value = !isShowSort.value;
};

const clickOutside = () => isShowSort.value = false;

const changeSort = () => {
  //
};
</script>

<style src="~/assets/styles/components/providers-filter.scss" lang="scss"/>