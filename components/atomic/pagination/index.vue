<template>
  <div class="pagination">
    <button class="prev">
      <atomic-icon id="ui-arrow_previous"/>
    </button>

    <button
      class="page"
      v-for="page in props.items.pages"
      :key="page"
      :class="{'is-selected': page === props.selected}"
      @click="emit('select-page', page)"
    >
      {{ page }}
    </button>

    <button class="next" disabled="disabled">
      <atomic-icon id="ui-arrow_next"/>
    </button>

    <span class="dots">...</span>
    <button class="total" v-if="props.total">{{ props.total }}</button>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    selected: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    items: {
      type: Object,
      default: () => ({
        pages: [1, 2, 3],
        total: 99,
        selected: 1,
      }),
    },
  });
  const emit = defineEmits(['select-page']);
</script>

<style lang="scss" src="./style.scss"/>
