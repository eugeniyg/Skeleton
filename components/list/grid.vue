<template>
  <div class="grid">
    <div ref="itemsContainer" class="items">
      <card-base v-for="item in props.items" :key="item.id" :game-info="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IGame, IPaginationMeta } from '@skeleton/api/types';
  import { initObserver } from '@skeleton/helpers/observer';

  const props = defineProps<{
    items: IGame[];
    meta: IPaginationMeta | undefined;
  }>();
  const emit = defineEmits(['loadMore']);

  const observerLoadMore = (): void => {
    if (props.meta && props.meta.totalPages > props.meta.page) emit('loadMore');
  };

  const itemsContainer = useTemplateRef('itemsContainer');
  const loadMoreObserver = ref();
  const lastItem = ref();

  const unobserveLastItem = (): void => {
    if (lastItem.value) {
      loadMoreObserver.value.unobserve(lastItem.value);
      lastItem.value.removeEventListener('inview', observerLoadMore);
    }
  };

  const observeLastItem = (): void => {
    unobserveLastItem();

    const listItems = itemsContainer.value?.children;
    lastItem.value = listItems ? [...listItems].at(-1) : undefined;
    if (lastItem.value) {
      loadMoreObserver.value.observe(lastItem.value);
      lastItem.value.addEventListener('inview', observerLoadMore);
    }
  };

  watch(
    () => props.items,
    async () => {
      await nextTick();
      observeLastItem();
    }
  );

  onMounted(() => {
    loadMoreObserver.value = initObserver({
      settings: { root: null, rootMargin: '100% 0% 100% 0%', threshold: 0 },
    });
    observeLastItem();
  });

  onBeforeUnmount(() => {
    unobserveLastItem();
  });
</script>

<style src="~/assets/styles/components/list/grid.scss" lang="scss" />
