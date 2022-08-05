<template>
  <div class="game-sort">
    <span class="label">Sort by:</span>
    <button
      v-for="{ id, title } in items"
      :key="id"
      :class="{ 'is-selected': props.value === id}"
      @click="changeSort(id)"
    >
      {{ title }}
    </button>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    value: {
      type: String,
      default: 'asc',
    },
  });

  const items = [
    {
      title: 'A-Z',
      id: 'asc',
    },
    {
      title: 'Z-A',
      id: 'desc',
    },
  ];

  const emit = defineEmits(['change']);
  const changeSort = (sortId: string):void => {
    if (props.value !== sortId) {
      emit('change', sortId);
    }
  };
</script>

<style lang="scss" src="./style.scss"/>
