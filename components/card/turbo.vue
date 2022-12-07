<template>
  <div class="card-turbo">
    <div class="content">
      <nuxt-link class="thumb" :to="localizePath(props.url)" :style="backgroundImage"/>
      <div class="title">{{ props.title }}</div>

      <div class="sub-title">{{ props.categoryValue }}</div>

      <button-base
        type="primary"
        size="xs"
        :url="props.url"
      >
        {{ props.buttonLabel }}
      </button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    buttonLabel: string,
    url: string,
    image: string,
    title: string,
    categoryValue: string
  }>();

  const backgroundImage = computed(() => `background-image:url(${props.image})`);
  const { localizePath } = useProjectMethods();
</script>

<style lang="scss">
.card-turbo {
  flex: none;
  order: 1;
  align-self: stretch;
  scroll-snap-align: var(--scroll-snap-align, start);
  border-radius: 16px;
  padding: rem(10px);
  width: calc(100% / 2.5 );

  @include media(xs) {
    --scroll-snap-align: unset;

    &:nth-of-type(2n + 1) {
      scroll-snap-align: start;
    }
  }

  @include media(sm) {
    --scroll-snap-align: unset;

    &:nth-of-type(3n + 1) {
      scroll-snap-align: start;
    }
  }

  @include media(md) {
    --scroll-snap-align: unset;

    &:nth-of-type(3n + 1) {
      scroll-snap-align: start;
    }
  }

  .thumb {
    width: 100%;
    display: block;
    position: relative;
    z-index: 1;
    border-radius: 8px;
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    overflow: hidden;
    margin: rem(-46px) auto rem(16px);
    box-shadow: 0 0 29px 4px rgba(0, 0, 0, 0.38);

    &:after {
      width: 100%;
      content: '';
      display: block;
      padding-top: calc(168 / 118 * 100%);
    }
  }

  .content {
    grid-area: content;
    display: grid;
    padding: rem(16px) rem(16px) rem(24px);
    grid-template-rows: auto auto 1fr;
    border-radius: 8px;
    height: 100%;
    min-width: 120px;
    background-color: var(--gray-800);
  }

  .title {
    @include font($heading-2);
    color: var(--white);
    margin-bottom: rem(4px);
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .sub-title {
    @include font($heading-0);
      color: var(--gray-400);
      padding: 0;
      margin: 0 0 rem(16px);
      justify-self: center;
  }

  .btn-primary {
    justify-self: center;

    &:hover {
      cursor: pointer;
    }
  }

  &:first-of-type {
    .btn-secondary {
      background: var(--gradient-new);
      --color: var(--gray-900);

      @media (hover: hover) {
        &:hover {
          background: var(--gradient-new-hover);
          --color: var(--black-primary);
        }
      }

      &:focus {
        background: var(--gradient-new-focus);
        --color: var(--black-primary);
      }
    }
  }

  @include media(xs) {
    width: calc(100% / 3.6);
  }

  @include media(sm) {
    width: calc(100% / 4.6);
  }

  @include media(md) {
    width: calc(100% / 5);
  }

  @include media(l) {
    width: calc(100% / 6);
  }

  @include media(xl) {
    width: calc(100% / 7);
  }

  @include media(xxl) {
    width: calc(100% / 8);
  }

  @include media(xxxl) {
    width: calc(100% / 9);
  }
}
</style>
