<template>
  <div class="tabs">
    <div class="header" v-if="props.items.length > 1">
      <button-base
        v-for="({ icon, title, id }, itemIndex) in props.items"
        :key="itemIndex"
        :class="{'is-active': props.selected === id}"
        @click="emit('select-tab', id)"
      >
        <atomic-icon :id="icon" v-if="icon"/>{{ title }}
      </button-base>
    </div>

    <div class="content">
      <slot/>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    items: {
      type: Array,
      default: () => ([
        {
          title: 'favorites',
          icon: 'heart',
          id: 'favorites',
          isActive: true,
        },
        // {
        //   title: 'Recently played',
        //   icon: 'history',
        //   id: 'recently-played',
        // },
      ]),
    },
    selected: {
      type: String,
      default: '',
    },
  });
  const emit = defineEmits(['select-tab']);
</script>

<style lang="scss">
.tabs {
  @include radius(16px);
  padding: rem(16px) rem(16px) rem(8px);
  background-color: var(--gray-900);

  .header {
    @extend %flex-items-center;
    padding: var(--padding, 0 0 8px 0);

    @include media(sm) {
      display: none;
    }

    .btn {
      @include font($body-1);
      --width: 100%;

      &.is-active {
        --bg: var(--gray-800);
        --icon-color: var(--white);
        --color: var(--white);
      }

      &:hover {
        cursor: pointer;
      }
    }
  }

  @include media(sm) {
    padding-bottom: rem(16px);

    .content {
      display: grid;
      grid-auto-flow: column;
      grid-column-gap: rem(24px);
      grid-auto-columns: minmax(0, 1fr);
    }

    .tab {
      display: block;
    }
  }
}
</style>
