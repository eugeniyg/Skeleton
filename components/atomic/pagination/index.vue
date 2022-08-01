<template>
  <div class="pagination">
    <button
      class="prev"
      :disabled="props.page === 1"
      @click="changePage(props.page - 1)"
    >
      <atomic-icon id="ui-arrow_previous"/>
    </button>

    <button
      class="page"
      v-for="page in paginationItems"
      :key="page"
      :class="[{'is-selected': page === props.page}, {dots: typeof page === 'string'}]"
      @click="changePage(page)"
    >
      {{ page }}
    </button>

    <button
      class="next"
      :disabled="props.page === props.totalPages"
      @click="changePage(props.page + 1)"
    >
      <atomic-icon id="ui-arrow_next"/>
    </button>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    page: {
      type: Number,
      required: true,
    },
    perPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    totalRows: {
      type: Number,
      required: true,
    },
  });
  const emit = defineEmits(['selectPage']);
  const changePage = (page: number|string):void => {
    if (typeof page === 'number' && page !== props.page) emit('selectPage', page);
  };

  const paginationItems = ref<any>([]);

  const formPagination = (maxItems: number):void => {
    let itemsArr:any = Array.from({ length: maxItems }, (_, i) => i + 1);

    if (props.totalPages > maxItems) {
      if (props.page < maxItems - 3) {
        itemsArr[maxItems - 2] = '...';
        itemsArr[maxItems - 1] = props.totalPages;
      } else if (props.page > props.totalPages - (maxItems - 3)) {
        itemsArr = itemsArr.map((item, index) => {
          if (!index) return 1;
          if (index === 1) return '...';
          return props.totalPages - (maxItems - index - 1);
        });
      } else {
        itemsArr = itemsArr.map((item, index) => {
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

  const paginationLength = ref<number>();
  onMounted(() => {
    if (window.innerWidth > 399) paginationLength.value = 9;
    else paginationLength.value = 7;
    formPagination(paginationLength.value);
  });

  watch(props, () => {
    formPagination(paginationLength.value);
  });
</script>

<style lang="scss" src="./style.scss"/>
