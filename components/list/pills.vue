<template>
  <div class="pills">
    <button
      v-for="(item, itemIndex) in props.items"
      :key="itemIndex"
      class="item"
      :class="{'is-selected': selected === item}"
      @click.prevent="emit('select', item)"
    >
      {{ item }}
    </button>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
    selected: {
      type: Number,
      default: -1,
    },
  });
  const emit = defineEmits(['select']);
</script>

<style src="~/assets/styles/components/list/pills.scss" lang="scss" />

