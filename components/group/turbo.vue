<template>
  <div v-if="groupTurboContent?.items?.length" class="group-turbo">
    <atomic-icon v-if="groupTurboContent?.icon" :id="groupTurboContent.icon"/>

    <h2 class="title">{{ groupTurboContent?.label }}</h2>

    <button-base
      class="btn-show-all"
      type="ghost"
      :url="'/games?category=turbogames'"
    >
      {{ groupCardContent?.moreButton }}
    </button-base>

    <button-arrows
      v-if="showArrowButtons"
      :prevDisabled="prevDisabled"
      :nextDisabled="nextDisabled"
      @clickAction="clickAction"
    />

    <div class="items-wrapper">
      <div
        ref="scrollContainer"
        class="items"
        @scroll="scrollHandler"
      >
        <card-turbo
          v-for="(item, itemIndex) in groupTurboContent.items"
          :key="itemIndex"
          v-bind="item"
          :buttonLabel="groupTurboContent.buttonLabel"
          :infoLabel="groupTurboContent.infoLabel"
          :categoryLabel="groupTurboContent.categoryLabel"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { TurbogamesGroupInterface, CardsGroupInterface } from '~/types';

  const { globalComponentsContent } = useGlobalStore();
  const groupTurboContent: TurbogamesGroupInterface | undefined = globalComponentsContent?.turbogames;
  const groupCardContent: CardsGroupInterface | undefined = globalComponentsContent?.cardsGroup;

  const scrollContainer = ref();
  const prevDisabled = ref<boolean>(true);
  const nextDisabled = ref<boolean>(false);
  const showArrowButtons = ref<boolean>(true);

  const scrollHandler = (): void => {
    if (!scrollContainer.value) return;
    const { scrollLeft, offsetWidth, scrollWidth } = scrollContainer.value;
    prevDisabled.value = scrollLeft === 0;
    nextDisabled.value = scrollWidth < (scrollLeft + offsetWidth + 20) && scrollWidth > (scrollLeft + offsetWidth - 20);
  };

  const clickAction = (direction: string): void => {
    const { offsetWidth } = scrollContainer.value;
    scrollContainer.value.scrollBy({
      left: direction === 'next' ? offsetWidth / 1.4 : -offsetWidth / 1.4,
      behavior: 'smooth',
    });
  };

  onMounted(() => {
    scrollHandler();
    showArrowButtons.value = !prevDisabled.value || !nextDisabled.value;
  });
</script>

<style lang="scss">
.group-turbo {
  display: grid;
  align-items: center;
  grid-template-areas:
    "icon heading heading arrows"
    "items items items items"
    "btn-show-all btn-show-all btn-show-all btn-show-all";
  grid-template-columns: minmax(0, auto) minmax(0, 1fr) minmax(0, auto) minmax(0, auto);
  grid-column-gap: var(--column-gap, #{rem(8px)});
  grid-row-gap: var(--row-gap, #{rem(8px)});
  position: relative;
  background-color: var(--gray-900);
  padding: rem(16px);
  border-radius: rem(16px);

  @include media(xs) {
    grid-template-areas:
    "icon heading btn-show-all arrows"
    "items items items items";
  }

  @include media(l) {
    padding: rem(24px) rem(24px) rem(16px);
  }

  > [data-icon] {
    font-size: rem(20px);
    grid-area: icon;
  }

  > .icon {
    grid-area: icon;
    --icon-size: #{rem(20px)};
    --color: var(--gray-400);
  }

  > .btn-show-all {
    @include font($heading-1);
    grid-area: btn-show-all;

    --font-size: #{rem(12px)};
    --color: var(--gray-500);
    --width: 100%;

    @include media(xs) {
      padding: 0;
      --bg: transparent;

      &:hover {
        --color: var(--white);
      }
    }
  }

  .arrows {
    grid-area: arrows;

    @include media(xs) {
      margin-left: rem(24px);
    }
  }

  > .title {
    @include font($heading-4);
    grid-area: heading;
    color: var(--white);
    flex-grow: 1;
    margin: 0;
  }

  .items-wrapper {
    grid-area: items;
    position: relative;
    margin-left: -28px;
    margin-right: -28px;

    @include media(sm) {
      margin-left: -48px;
      margin-right: -48px;
    }

    @include media(md) {
      margin-left: -10px;
      margin-right: -10px;
    }
  }

  .items {
    display: var(--display, flex);
    padding: rem(32px) 0 0 0;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;

    &:before {
      grid-area: start;
      content: "";
      min-width: 16px;
      max-width: 38px;
      min-height: rem(20px);
      position: relative;
      display: flex;
      scroll-snap-align: start;
      order: 1;

      @include media(sm) {
        min-width: 38px;
      }
    }

    &:after {
      grid-area: end;
      content: "";
      min-width: 16px;
      max-width: 38px;
      min-height: rem(20px);
      position: relative;
      display: flex;
      scroll-snap-align: end;
      order: 3;

      @include media(sm) {
        min-width: 38px;
      }
    }

    @include media(md) {
      scroll-padding: 0;
      margin-right: 0;
      margin-left: 0;

      &:before, &:after {
        display: none;
      }
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
