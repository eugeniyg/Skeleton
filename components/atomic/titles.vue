<template>
  <div class="titles">
    <slot>
      <div class="title" v-if="props.title">{{ props.title }}</div>
      <div class="sub-title" v-if="props.subTitle">{{ props.subTitle }}</div>
    </slot>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{title?: string, subTitle?: string}>();
</script>

<style lang="scss">
.titles {
  display: grid;
  grid-row-gap: rem(4px);

  .title {
    @include font($heading-2);
    color: var(--color, var(--gray-400));
    margin: 0;
    padding: 0;
  }

  .sub-title {
    @include font($body-2);
    color: var(--color, var(--gray-400));
    margin: 0;
    padding: 0;
  }
}
</style>
