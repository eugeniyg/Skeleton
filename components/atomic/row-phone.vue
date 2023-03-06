<template>
  <div class="row-phone">
    <img
      class="img"
      :src="`/img${props.src}`"
      width="24"
      height="20"
      alt=""
    />
    {{ props.number }}
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    src: {
      type: String,
      default: '/flags/us.svg',
    },
    number: {
      type: String,
      default: '-',
    },
  });
</script>

<style lang="scss">
.row-phone {
  display: flex;
  align-items: center;
  grid-column-gap: rem(8px);

  .img {
    height: rem(20px);
    width: rem(24px);
  }

  .item {
    @include font($body-2);
  }
}
</style>
