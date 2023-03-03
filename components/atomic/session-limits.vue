<template>
  <div class="session-limits">
    <div
      class="session-limits__item"
      v-for="(item, index) in props.items"
      :key="item.value"
    >
      <div class="session-limits__input">
        <span class="session-limits__value">{{ item.value }}</span>
        <div class="session-limits__actions" v-if="index === 0">
          <button-base type="primary" @click="emit('back')">
            <atomic-icon id="edit"/>
          </button-base>
          <button-base type="ghost" @click="emit('remove')">
            <atomic-icon id="trash"/>
          </button-base>
        </div>
      </div>

      <!-- statuses: pending, active-->

      <div
        class="session-limits__status"
        :class="`session-limits__status--${item.status.type}`"
      >
        <span class="session-limits__status-dot"></span>
        <span class="session-limits__status-msg">{{ item.status.msg }}</span>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    items: {
      type: Array,
      required: true,
    },
  });

  const emit = defineEmits(['back', 'remove']);
</script>

<style lang="scss">
.session-limits {
  display: grid;
  grid-row-gap: 16px;

  &__item {
    display: grid;
  }

  &__input {
    display: flex;
    align-items: center;
    grid-column-gap: 8px;
    min-height: 21px;
  }

  &__value {
    @include font($heading-3);
    color: var(--white);
    flex-grow: 1;
  }

  &__status {
    display: flex;
    align-items: flex-start;
    grid-column-gap: 2px;
    margin-top: 4px;

    &--pending {
      --dot-bg: var(--yellow-500);
    }

    &--active {
      --dot-bg: var(--green-500);
    }

    &-dot {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:before {
        content: '';
        display: block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: var(--dot-bg, var(--yellow-500));
      }
    }

    &-msg {
      @include font($body-0);
      color: var(--white);
    }
  }

  &__actions {
    display: flex;
    grid-column-gap: 4px;

    .btn-primary {
      width: 32px;
      height: 32px;
      --padding: 0;
      --bg: var(--gradient-radial);

      &:hover {
        --bg: var(--gradient-radial-hover);
      }

      &:active {
        --bg: var(--gradient-radial-focus);
      }

      &[disabled] {
        --bg: var(--yellow-900);
        --color: var(--black-primary);
      }
    }

    .btn-ghost {
      width: 32px;
      height: 32px;
      --padding: 0;
      --color: var(--gray-400);

      &:hover {
        --color: var(--yellow-500);
      }

      &:active {
        --bg: var(--gray-700);
      }

      &[disabled] {
        --color: var(--gray-600);
      }
    }
  }
}
</style>
