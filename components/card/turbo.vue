<template>
  <div class="card-turbo">
    <nuxt-link class="thumb" :to="localizePath(props.url)" :style="backgroundImage" />

    <div class="content">
      <div class="title">{{ props.title }}</div>

      <button-base
        type="secondary"
        size="xs"
        :url="props.url"
      >
        {{ props.buttonLabel }}
      </button-base>

      <dl class="dl">
        <dt class="dl__title">{{ props.infoLabel }}</dt>
        <dd class="dl__value">{{ props.categoryLabel }}</dd>
        <dt class="dl__sub-title">{{ props.infoValue }}</dt>
        <dd class="dl__sub-value">{{ props.categoryValue }}</dd>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    buttonLabel: string,
    infoLabel: string,
    categoryLabel: string,
    url: string,
    image: string,
    title: string,
    infoValue: string,
    categoryValue: string
  }>();

  const backgroundImage = computed(() => `background-image:url(${props.image})`);
  const { localizePath } = useProjectMethods();
</script>

<style lang="scss">
.card-turbo {
  min-width: var(--min-width, #{rem(221px)});
  display: grid;
  grid-template-areas: "img content";
  grid-template-columns: rem(94px) 1fr;
  border-radius: 8px;
  flex: none;
  order: 1;
  align-self: stretch;
  border-right: 8px solid var(--black-primary);
  border-left: 8px solid var(--black-primary);
  scroll-snap-align: var(--scroll-snap-align, start);

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
    grid-area: img;
    width: var(--card-width, #{rem(94px)});
    min-height: var(--card-height, #{rem(140px)});
    display: block;
    position: relative;
    z-index: 1;
    border-radius: 8px;
    background-position: center center;
    background-size: 100%;
    background-repeat: no-repeat;
    margin-top: rem(-11px);
    margin-bottom: rem(-11px);
    overflow: hidden;
  }

  .content {
    grid-area: content;
    display: grid;
    padding: rem(12px) rem(12px) rem(12px) rem(10px);
    background-image: linear-gradient(187.95deg, #140D2B 44.73%, #28263B 93.88%);
    border-radius: 0 8px 8px 0;
    grid-row-gap: 8px;
    align-content: flex-start;
    grid-template-rows: auto auto 1fr;
  }

  .title {
    @include font($heading-2);
    color: var(--white);
    align-self: flex-start;
  }

  .dl {
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: rem(34px) 1fr;
    grid-column-gap: rem(4px);
    align-self: flex-end;

    &__title {
      padding: 0;
      @include font($body-0);
      color: var(--gray-400);
    }

    &__value {
      padding: 0;
      margin: 0;
      @include font($body-0);
      color: var(--gray-400);
    }

    &__sub-title {
      padding: 0;
      @include font($heading-0);
      color: var(--yellow-500);
    }

    &__sub-value {
      padding: 0;
      margin: 0;
      @include font($heading-0);
      color: var(--gray-400);
    }
  }

  .btn-secondary {
    align-self: flex-start;

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
    --min-width: #{column(3)};
  }

  @include media(sm) {
    --min-width: #{column(4)};
  }

  @include media(md) {
    --min-width: #{column(4)};
  }

  @include media(l) {
    --min-width: #{column(4)};
  }

  @include media(xl) {
    --min-width: #{column(5)};
  }

  @include media(xxl) {
    --min-width: #{column(6)};
  }
}
</style>
