<template>
  <div class="pass-progress">
    <div class="items">
      <div
        class="item"
        v-for="(item, index) in variants"
        :key="index"
        :class="index <= getIndex ? `variant-${variants[getIndex]}` : null"
      />
    </div>

    <atomic-hint :message="variants[getIndex]"/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    variant: {
      type: String,
      validator: (val:string) => ['weak', 'good', 'strong'].includes(val),
    },
    target: {
      type: String,
      default: '',
    },
  });
  const variants = ['weak', 'good', 'strong'];
  const getIndex = computed(() => variants.findIndex((item) => item === props.target));
</script>

<style lang="scss">
.pass-progress {
  display: grid;
  grid-row-gap: rem(4px);

  .items {
    display: flex;
    width: 100%;
    grid-column-gap: rem(4px);
  }

  .item {
    background-color: var(--gray-400);
    position: relative;
    flex-grow: 1;
    height: rem(4px);
    border-radius: 2px;
    overflow: hidden;

    &:after {
      position: absolute;
      display: block;
      content: '';
      left: 0;
      top: 0;
      bottom: 0;
      right: 100%;
      background-color: var(--bg, transparent);
      transition: right .2s .2s ease;
    }
  }

  .variant-weak {
    &:after {
      right: 0;
      --bg: var(--red-500);
    }
  }

  .variant-good {
    &:after {
      right: 0;
      --bg: var(--yellow-500);
    }

  }

  .variant-strong {
    &:after {
      right: 0;
      --bg: var(--green-500);
    }
  }
}
</style>
