<template>
  <div class="providers-filter">
    <form-input-search
      v-model:value="searchValue"
      class="providers-filter__search"
      :placeholder="getContent(props.currentLocaleContent, props.defaultLocaleContent, 'searchPlaceholder')"
      @input="searchInput"
    />

    <div class="providers-filter__toggle-sort" :class="{ 'is-active': isShowSort }" @click="toggleSort">
      <atomic-icon id="filter" />
    </div>

    <atomic-providers-sort
      :class="{ 'show-sort': isShowSort }"
      :sort-by="props.filters.sortBy || 'order'"
      :sort-order="props.filters.sortOrder || 'asc'"
      :sort-options="getContent(props.currentLocaleContent, props.defaultLocaleContent, 'sortOptions')"
      :label="getContent(props.currentLocaleContent, props.defaultLocaleContent, 'sortLabel')"
      @change="changeSort"
    />
  </div>
</template>

<script setup lang="ts">
  import debounce from 'lodash/debounce';
  import type { IProvidersRequest } from '@skeleton/api/types';
  import type { IProvidersPage } from '~/types';

  const props = defineProps<{
    currentLocaleContent: Maybe<IProvidersPage>;
    defaultLocaleContent: Maybe<IProvidersPage>;
    filters: IProvidersRequest;
  }>();

  const searchValue = ref<string>(props.filters.name || '');
  const isShowSort = ref<boolean>(!!props.filters.sortBy || !!props.filters.sortOrder);

  const emit = defineEmits(['onSearch', 'changeSort']);

  const searchInput = debounce(
    (): void => {
      if (searchValue.value.length > 1 || !searchValue.value) {
        emit('onSearch', searchValue.value || undefined);
      }
    },
    500,
    { leading: false }
  );

  const toggleSort = () => {
    isShowSort.value = !isShowSort.value;
  };

  const changeSort = (newSortData: { sortBy: string; sortOrder: string }) => {
    emit('changeSort', newSortData);
  };
</script>

<style src="~/assets/styles/components/providers-filter.scss" lang="scss" />
