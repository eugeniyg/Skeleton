<template>
  <div class="grid">
    <div class="items">
      <card-base v-for="item in props.items" :key="item.id" ref="cards" :game-info="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IGame, IPaginationMeta } from '@skeleton/core/types';

  const props = defineProps<{
    items: IGame[];
    meta: IPaginationMeta | undefined;
  }>();
  const emit = defineEmits(['loadMore']);
  const { initObserver } = useProjectMethods();

  const observerLoadMore = (): void => {
    if (props.meta && props.meta.totalPages > props.meta.page) emit('loadMore');
  };

  const loadMoreObserver = ref();
  const cards = ref([]);
  const lastItem = ref();

  const unobserveLastItem = (): void => {
    if (lastItem.value) {
      loadMoreObserver.value.unobserve(lastItem.value.$el);
      lastItem.value.$el.removeEventListener('inview', observerLoadMore);
    }
  };

  const observeLastItem = (): void => {
    unobserveLastItem();

    lastItem.value = cards.value[cards.value?.length - 1];
    if (lastItem.value) {
      loadMoreObserver.value.observe(lastItem.value.$el);
      lastItem.value.$el.addEventListener('inview', observerLoadMore);
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
