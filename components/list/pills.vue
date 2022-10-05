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

<style lang="scss">
.pills {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  grid-gap: rem(4px);
  margin-bottom: rem(8px);

  .item {
    @extend %skip-btn;
    @include font($heading-2);
    padding: rem(7px) rem(16px);
    border-radius: 8px;
    flex-grow: 1;
    text-align: center;

    &.is-selected {
      --bg: var(--yellow-500);
      --color: var(--black-primary);
    }

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
