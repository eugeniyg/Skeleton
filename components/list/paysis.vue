<template>
  <div class="paysis">
    <img
      v-for="(src, index) in props.items"
      :key="index"
      class="logo"
      :src="`/img${src}`"
      alt=""
      width="114"
      height="24"
    />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
  });
</script>

<style lang="scss">
.paysis {
  display: flex;
  align-items: center;
  grid-gap: rem(24px);
  overflow-x: auto;

  @include media(sm) {
    overflow-x: hidden;
    justify-content: center;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  > .logo {
    display: block;
    height: rem(24px);
    width: auto;
    user-select: none;
  }
}
</style>
