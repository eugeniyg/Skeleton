<template>
  <div class="accordeon" :class="classes">
    <div class="header">
      <slot name="header" :heading="props.heading" />
      <button-toggle :is-active="state" @toggle="toggle" />
    </div>

    <div ref="content" class="content" :style="heightStyle">
      <slot
        v-for="(item, index) in props.items"
        :key="index"
        name="content"
        :item="item"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    isOpen: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      validator: (val:string) => ['toggle', 'expand'].includes(val),
      default: 'toggle',
    },
    heading: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: () => [],
    },
  });

  const state = ref<boolean>(props.isOpen);
  const closedHeight = ref<number>(0);
  const openHeight = ref<number>(0);

  const classes = computed(() => ({
    'is-open': state.value,
    [`mode-${props.mode}`]: true,
  }));
  const heightStyle = computed(() => `--height: ${state.value ? openHeight.value : closedHeight.value}px`);

  function toggle():void {
    state.value = !state.value;
  }

  const content = ref<HTMLElement>();
  onMounted(() => {
    openHeight.value = content.value?.scrollHeight || 0;
  });
</script>

<style lang="scss">
.accordeon {
  .header {
    @include font($heading-2);
    display: flex;
    align-items: center;
    padding: var(--padding, 0 0 #{rem(8px)} 0);
    color: var(--gray-300);
    margin: 0;
    justify-content: space-between;

    *  {
      padding: 0;
      margin: 0;
    }
  }

  .content {
    overflow: hidden;
    height: var(--height, 0);
    transition: height .1s ease-in-out;
    display: grid;
    grid-row-gap: rem(8px);

    a {
      display: block;
      @include font($heading-1);
      color: var(--color, var(--gray-500));
      text-decoration: none;
      transition: color .2s ease-in-out;

      &:hover {
        cursor: pointer;
        --color: var(--white);
      }
    }
  }

  &.mode-toggle {
    .btn-toggle {
      --color: var(--white);
    }
  }

  &.mode-expand {
    .btn-toggle {
      --bg: transparent;
      --deg: 0;
      --color: var(--white);
    }
  }
}
</style>
