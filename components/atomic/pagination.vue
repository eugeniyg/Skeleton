<template>
  <div class="pagination">
    <button class="prev" :disabled="props.page === 1" @click="changePage(props.page - 1)">
      <atomic-icon id="arrow-previous" />
    </button>

    <button
      v-for="pageItem in paginationItems"
      :key="pageItem"
      class="page"
      :class="[{ 'is-selected': pageItem === props.page }, { dots: typeof pageItem === 'string' }]"
      @click="changePage(pageItem)"
    >
      {{ pageItem }}
    </button>

    <button class="next" :disabled="props.page === props.totalPages" @click="changePage(props.page + 1)">
      <atomic-icon id="arrow-next" />
    </button>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    page: number;
    perPage: number;
    totalPages: number;
    totalRows: number;
  }>();

  const emit = defineEmits(['selectPage']);
  const changePage = (page: number | string): void => {
    if (typeof page === 'number' && page !== props.page) emit('selectPage', page);
  };

  const paginationItems = ref<any>([]);

  const formPagination = (maxItems: number): void => {
    let itemsArr: any = Array.from({ length: maxItems }, (_, i) => i + 1);

    if (props.totalPages > maxItems) {
      if (props.page < maxItems - 3) {
        itemsArr[maxItems - 2] = '...';
        itemsArr[maxItems - 1] = props.totalPages;
      } else if (props.page > props.totalPages - (maxItems - 3)) {
        itemsArr = itemsArr.map((item: number, index: number) => {
          if (!index) return 1;
          if (index === 1) return '...';
          return props.totalPages - (maxItems - index - 1);
        });
      } else {
        itemsArr = itemsArr.map((item: number, index: number) => {
          if (!index) return 1;
          if (index === 1 || index === maxItems - 2) return '...';
          if (index === maxItems - 1) return props.totalPages;
          return props.page - (Math.floor(maxItems / 2) - index);
        });
      }
    } else {
      itemsArr = itemsArr.slice(0, props.totalPages);
    }
    paginationItems.value = itemsArr;
  };

  const paginationLength = ref<number>(9);
  onMounted(() => {
    if (window.innerWidth > 399) paginationLength.value = 9;
    else paginationLength.value = 7;
    formPagination(paginationLength.value);
  });

  watch(props, () => {
    formPagination(paginationLength.value);
  });
</script>

<style src="~/assets/styles/components/atomic/pagination.scss" lang="scss" />
