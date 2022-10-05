<template>
  <div class="nav-static">
    <nuxt-link
      v-for="(item, itemIndex) in props.items"
      :key="itemIndex"
      :to="localizePath(item.url)"
    >
      {{ item.label }}
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
  });

  const { localizePath } = useProjectMethods();
</script>

<style lang="scss">
.nav-static {
  display: var(--display, flex);
  flex-direction: column;
  grid-gap: rem(4px);

  .drawer-minimize & {
    @include media(l) {
      --display: none;
    }
  }

  > a {
    @include font($heading-1);
    color: var(--color, var(--gray-300));
    padding: rem(4px) rem(20px);
    text-decoration: none;
    display: flex;
    transition: color .2s .2s ease-in-out;

    &:hover {
      --color: var(--white);
    }
  }
}
</style>
