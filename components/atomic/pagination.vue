<template>
  <div class="pagination">
    <button
      class="prev"
      :disabled="props.page === 1"
      @click="changePage(props.page - 1)"
    >
      <atomic-icon id="arrow_previous"/>
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
      <atomic-icon id="arrow_next"/>
    </button>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    page: number,
    perPage: number,
    totalPages: number,
    totalRows: number
  }>();

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
        itemsArr = itemsArr.map((item:number, index:number) => {
          if (!index) return 1;
          if (index === 1) return '...';
          return props.totalPages - (maxItems - index - 1);
        });
      } else {
        itemsArr = itemsArr.map((item:number, index:number) => {
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

<style lang="scss">
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;

  .page, .prev, .next, .total {
    @extend %skip-btn;
    min-width: var(--min-width, rem(32px));
    height: var(--height, rem(32px));
    border-radius: 8px;
    background-color: var(--bg, transparent);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color, var(--white));

    &:hover {
      cursor: pointer;
      --bg: var(--gray-800);
      --color: var(--yellow-500);
    }
  }

  .dots {
    @include font($heading-1);
    @extend %skip-btn;
    padding: rem(8px) rem(11px);
    height: var(--height, rem(32px));
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none !important;
  }

  .total {
    @extend %skip-btn;
    @include font($heading-1);
    padding: rem(8px);
    --min-width: auto;
  }

  .page {
    @include font($heading-1);

    &.is-selected {
      --bg: var(--gray-800);
      --color: var(--yellow-500);
    }
  }

  .icon {
    --color: var(--white);
  }

  .prev, .next {
    &[disabled] {
      pointer-events: none;

      .icon {
        --color: var(--gray-600);
      }
    }

    &:focus {
      --bg: var(--gray-800);

      .icon {
        --color: var(--yellow-500);
      }
    }
  }
}
</style>
