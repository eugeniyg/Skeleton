<template>
  <form class="form-filters">
    <span class="label">Sort by:</span>
    <button
      v-for="{ id, title } in props.items"
      :key="id"
      :class="{ 'is-selected': selected === id}"
      @click.prevent="selected = id"
    >
      {{ title }}
    </button>
  </form>
</template>

<script setup lang="ts">
  const props = defineProps({
    items: {
      type: Array,
      default: () => [
        {
          title: 'Most popular',
          id: 'most-popular',
        },
        {
          title: 'Recent',
          id: 'recent',
        },
        {
          title: 'A-Z',
          id: 'az',
        },
        {
          title: 'Z-A',
          id: 'za',
        },
      ],
    },
  });

  const selected = ref<string>('most-popular');
</script>

<style lang="scss" src="./style.scss"/>
