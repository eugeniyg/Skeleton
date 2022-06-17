<template>
  <div class="pills">
    <button
      class="item"
      v-for="(item, itemIndex) in props.items"
      :key="itemIndex"
      @click.prevent="emit('select', item)"
      :class="{'is-selected': selected === item}"
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

<style lang="scss" src="./style.scss"/>
