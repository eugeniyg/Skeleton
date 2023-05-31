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

<style src="~/assets/styles/components/list/grid.scss" lang="scss" />

