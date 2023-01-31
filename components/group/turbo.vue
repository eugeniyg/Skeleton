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

    <!--    <div class="items-wrapper">-->
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
      <!--      </div>-->
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
  grid-row-gap: var(--row-gap, #{rem(16px)});
  position: relative;
  background-color: var(--gray-900);
  padding: rem(16px);
  border-radius: rem(16px);

  @include media(xs) {
    grid-template-areas:
    "icon heading btn-show-all arrows"
    "items items items items";
    padding: rem(16px) rem(16px) rem(24px);
  }

  @include media(sm) {
    padding: rem(16px) rem(24px) rem(16px);
  }

  @include media(md) {
    @include scroll-overlay;
    padding: rem(24px);
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
    margin-left: rem(16px);

    @include media(sm) {
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

  .items {
    grid-area: items;
    display: var(--display, flex);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    padding: rem(32px) rem(32px) 0 rem(32px);
    margin: 16px rem(-32px) 0;
    scroll-padding: rem(32px);
    grid-column-gap: rem(8px);

    @include media(sm) {
      margin: 0;
      padding: rem(32px) 0;
      scroll-padding: 0;
      grid-column-gap: rem(16px);
    }

    @include media(md) {
      padding: rem(24px) 0 0;
      margin: 0;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
