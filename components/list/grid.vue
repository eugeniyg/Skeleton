<template>
  <div class="grid">
    <div class="items">
      <card-base v-for="item in props.items" :key="item.id" v-bind="item"/>
    </div>

    <button-load-more v-show="props.meta.totalPages > props.meta.page" ref="loadMore" />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
    meta: {
      type: Object,
      required: true,
    },
  });
  const emit = defineEmits(['loadMore']);

  const loadMore = ref();
  const { initObserver } = useCoreMethods();

  const observerLoadMore = ():void => {
    if (props.meta.totalPages > props.meta.page) emit('loadMore');
  };

  onMounted(async () => {
    initObserver(loadMore.value.$el, {
      onInView: observerLoadMore,
      settings: { root: null, rootMargin: '0px 0px 400px 0px', threshold: 0 },
    });
  });
</script>

<style lang="scss">
.grid {
  .items {
    display: grid;
    flex-wrap: wrap;
    grid-template-columns: repeat(3, 1fr);
    margin: -4px -4px 0;

    @include media(sm) {
      grid-template-columns: repeat(6, 1fr);
    }

    @include media(xl) {
      grid-template-columns: repeat(9, 1fr);
    }
  }

  .item {
    background: var(--gray-500);
    border-radius: rem(8px);
  }

  .btn-load-more {
    margin: auto;
    visibility: hidden !important;
    opacity: 0 !important;
  }

  .card-base {
    --min-width: 100%;
  }
}
</style>
