<template>
  <div class="bonus">
    <img v-if="props.image" class="img" :src="props.image">
    <div class="title">
      {{ props.title }}
    </div>
    <div v-if="props.description" class="sub-title">
      {{ props.description }}
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    image?: string,
    title: string,
    description?: string
  }>();
</script>

<style lang="scss">
.bonus {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas: "img title" "img sub-title";
  grid-template-rows: minmax(0, auto) minmax(0, auto);
  grid-row-gap: rem(4px);
  grid-column-gap: rem(8px);
  align-items: center;

  .img {
    width: rem(40px);
    height: rem(40px);
    grid-area: img;
  }

  .title {
    grid-area: title;
    @include font($heading-2);
    color: var(--white);
  }

  .sub-title {
    grid-area: sub-title;
    @include font($heading-2);
    color: var(--yellow-500);
  }
}
</style>
