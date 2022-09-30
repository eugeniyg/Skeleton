<template>
  <nuxt-link class="card-latest-winners" :to="localizePath(`${props.href}${!isLoggedIn ? '?demo=true' : '' }`)">
    <div class="img" :style="backgroundImage"></div>
    <div class="title">{{ props.title }}</div>
    <div class="sub-title">{{ props.subTitle }}</div>
    <div class="items">
      <span v-for="(item, itemIndex) in props.items" :key="itemIndex" class="item">{{ item }}</span>
    </div>
  </nuxt-link>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    src: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    subTitle: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: () => [],
    },
    href: {
      type: String,
      default: '',
    },
  });

  const { localizePath } = useProjectMethods();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);

  const backgroundImage = computed(() => `background-image:url(/img${props.src})`);
</script>

<style lang="scss">
.card-latest-winners {
  width: var(--min-width, #{rem(230px)});
  height: var(--height, auto);
  padding: rem(8px);
  background-color: var(--bg, var(--gray-800));
  display: grid;
  grid-template-areas:
    "img title"
    "img sub-title"
    "img items";
  grid-template-columns: rem(56px) 1fr;
  grid-column-gap: rem(8px);
  border-radius: rem(8px);
  flex-shrink: 0;
  align-self: stretch;
  align-items: flex-start;
  text-decoration: none;
  @extend %cards-items;

  @include media(md) {
    --min-width: #{column(5)};
  }

  @include media(xxl) {
    --min-width: #{column(6)};
  }

  .img {
    grid-area: img;
    width: rem(56px);
    height: rem(56px);
    background-repeat: var(--bg-repeat, no-repeat);
    background-size: var(--bg-size, cover);
    background-position: var(--bg-position, top center);
    border-radius: 8px;
    overflow: hidden;
    align-self: center;
  }

  .title {
    grid-area: title;
    @include font($body-1);
    color: var(--gray-300);
  }

  .sub-title {
    grid-area: sub-title;
    @include font($heading-1);
    color: var(--white);
  }

  .items {
    grid-area: items;
    @include font($heading-2);
    @extend %flex-items-center;
    grid-column-gap: 8px;
    color: var(--yellow-500);
    margin-top: rem(4px);
  }
}
</style>
