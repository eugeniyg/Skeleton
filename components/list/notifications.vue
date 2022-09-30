<template>
  <div class="notifications">
    <div class="header">
      <div class="total">{{ props.items.length }} notifications</div>

      <button-base
        v-if="isShowMarkReadBtn"
        type="ghost"
        size="xs"
        :is-disabled="!props.items.length"
      >
        <atomic-icon id="read-all"/>Mark all as read
      </button-base>
    </div>
    <atomic-divider/>
    <template v-if="props.items.length > 0">
      <div class="items">
        <atomic-msg v-for="(item, index) in filteredItems" :key="index" v-bind="item"/>
      </div>
      <template v-if="isShowReadAllBtn">
        <atomic-divider/>
        <button-base type="ghost" size="xs" @click="emit('read-all')">
          Read all<atomic-icon id="arrow_next"/>
        </button-base>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    isShowMarkReadBtn: {
      type: Boolean,
      default: true,
    },
    isShowReadAllBtn: {
      type: Boolean,
      default: false,
    },
    max: {
      type: Number,
      default: 5,
    },
    items: {
      type: Array,
      default: () => [],
    },
  });
  const filteredItems = computed(() => (props.max ? props.items.slice(0, props.max) : props.items));
  const emit = defineEmits(['read-all']);
</script>

<style lang="scss">
.notifications {
  display: grid;
  grid-gap: rem(8px);

  .header {
    @include font($body-1);
    color: var(--gray-400);
    justify-content: space-between;
    align-items: center;
    display: flex;
    margin-bottom: rem(16px);
  }

  hr {
    --margin: 0;
  }

  .items {
    display: grid;
    grid-gap: rem(8px);
  }

  > .btn-ghost {
    --width: 100%;
  }
}
</style>
